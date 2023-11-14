/** 尺寸 */
interface size {
  /** s号 */
  s
  /** m号 */
  m
  /** l号 */
  l
}

interface GradeProps {
  /**
   * 当前评分值
   */
  value: number;
  /**
   * 值变化回调函数
   */
  onChange?: (value: number) => void;
  /**
   * 图标尺寸
   */
  size?: keyof size
}

declare const Grade: React.FC<GradeProps>;

export {
  Grade
};
