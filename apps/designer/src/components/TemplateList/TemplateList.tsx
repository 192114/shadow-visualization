// import { useDndContext } from '@dnd-kit/core';
import TemplateItem from './TemplateItem'
// import { DraggableOverlay } from '../DraggableOverlay'

import styles from './TemplateList.module.css'

export function TemplateList() {
  // const dndContext = useDndContext();
  // console.log(dndContext)
  return (
    <div className={styles.container}>
      <TemplateItem type="line" />
      {/* <DraggableOverlay /> */}
    </div>
  )
}
