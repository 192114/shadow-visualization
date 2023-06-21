import { useEffect, useRef } from 'react'

import { useConfigPanelStore } from '~/store'

import styles from './EditorContainer.module.css'
import RulerComponent, { type RulerHandle } from './Ruler'

interface EditorWrapperProps {
  width: number
  ratio: number
}

interface EditorProps {
  children: JSX.Element
  wrapper: EditorWrapperProps
}

export default function EditorContainer(props: EditorProps) {
  const { wrapper, children } = props

  const leftRuler = useRef<RulerHandle | null>(null)
  const topRuler = useRef<RulerHandle | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)

  const configPanelOpen = useConfigPanelStore((state) => state.open)

  useEffect(() => {
    const scrollHandle = (e: Event) => {
      const { scrollLeft, scrollTop } = e.currentTarget as HTMLDivElement
      leftRuler.current?.scroll(scrollTop)
      topRuler.current?.scroll(scrollLeft)
    }

    const scrollDom = panel.current

    scrollDom?.addEventListener('scroll', scrollHandle)

    return () => {
      scrollDom?.removeEventListener('scroll', scrollHandle)
    }
  }, [])

  useEffect(() => {
    leftRuler.current?.resize()
    topRuler.current?.resize()
  }, [configPanelOpen])

  return (
    <div className={styles.container} ref={panel}>
      <RulerComponent pos="top" ref={topRuler} />
      <RulerComponent pos="left" ref={leftRuler} />

      <div
        className={styles.editor}
        style={{ width: wrapper.width, height: wrapper.width * wrapper.ratio }}
      >
        {children}

        <div className={styles.gridBox} />
      </div>
    </div>
  )
}
