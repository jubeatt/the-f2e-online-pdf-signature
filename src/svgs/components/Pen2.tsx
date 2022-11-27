interface Props {
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}

const Pen2: React.FC<Props> = (props) => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={props.onClick}
    >
      <g clipPath='url(#clip0_48_439)'>
        <path
          d='M14.1679 0.753899L12.2773 2.64452L17.3554 7.72265L19.2461 5.83202C20.2226 4.85546 20.2226 3.27343 19.2461 2.29687L17.707 0.753899C16.7304 -0.222664 15.1484 -0.222664 14.1718 0.753899H14.1679ZM11.3945 3.52734L2.28904 12.6367C1.88279 13.043 1.58591 13.5469 1.42185 14.0976L0.0390359 18.7969C-0.0586203 19.1289 0.0312234 19.4844 0.273411 19.7266C0.515598 19.9687 0.871067 20.0586 1.19919 19.9648L5.89841 18.582C6.44919 18.418 6.9531 18.1211 7.35935 17.7148L16.4726 8.60546L11.3945 3.52734Z'
          fill='#A5A39C'
        />
      </g>
      <defs>
        <clipPath id='clip0_48_439'>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Pen2
