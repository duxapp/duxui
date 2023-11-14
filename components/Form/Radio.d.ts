import { ReactNode, CSSProperties, FC } from 'react';

type Direction = 'horizontal' | 'vertical';

interface RadioGroupProps {
  /**
   * 单选按钮组件
   */
  children: ReactNode;
  /**
   * 当前选中的值
   */
  value: any;
  /**
   * 值改变时的回调函数
   */
  onChange?: (value: any) => void;
  /**
   * 单选按钮的布局方向
   */
  direction?: Direction;
  /**
   * 附加在单选按钮组容器上的 CSS 类名
   */
  className?: string;
  /**
   * 附加在单选按钮组容器上的样式
   */
  style?: CSSProperties;
  /**
   * 其他属性
   */
  [key: string]: any;
}

interface RadioProps {
  /**
   * 单选按钮的值
   */
  value: any;
  /**
   * 单选按钮的标签文字
   */
  label?: ReactNode;
  /**
   * 附加在单选按钮容器上的 CSS 类名
   */
  className?: string;
  /**
   * 其他属性
   */
  [key: string]: any;
}

interface RadioContextValue {
  /**
   * 单选按钮选择函数
   */
  check: (value: any) => void;
  /**
   * 当前选中的值
   */
  currentValue: any;
}

declare const Radio: FC<RadioProps>;

declare namespace Radio {
  const Group: FC<RadioGroupProps>;
}

export { Radio };
