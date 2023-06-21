import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Ruler from '@scena/react-ruler'
import cn from 'classnames'

import styles from './Ruler.module.css'

export interface RulerProps {
  pos: 'top' | 'left'
}

export interface RulerHandle {
  resize: () => void
  scroll: (scrollPos: number) => void
}

const RulerComponent = forwardRef<RulerHandle, RulerProps>(function (
  props,
  ref
) {
  const { pos } = props

  const rulerRef = useRef<Ruler | null>(null)

  useEffect(() => {
    const resizeHandle = () => {
      rulerRef.current?.resize()
    }

    window.addEventListener('resize', resizeHandle)

    return () => {
      window.removeEventListener('resize', resizeHandle)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    resize: () => {
      rulerRef.current?.resize()
    },
    scroll: (scrollPos) => {
      rulerRef.current?.scroll(scrollPos)
    },
  }))

  return (
    <>
      <div className={styles.fill} />
      <div
        className={cn({
          [styles.vertical]: pos === 'left',
          [styles.horizontal]: pos === 'top',
        })}
      >
        <Ruler
          ref={rulerRef}
          type={pos === 'top' ? 'horizontal' : 'vertical'}
        />
      </div>
    </>
  )
})

RulerComponent.displayName = 'RulerComponent'

export default RulerComponent
