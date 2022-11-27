interface Props {
  className?: string
  onClick?: React.MouseEventHandler<SVGSVGElement>
}

const Search: React.FC<Props> = (props) => {
  return (
    <svg
      className={props.className}
      width='34'
      height='34'
      viewBox='0 0 34 34'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={props.onClick}
    >
      <path
        d='M23.8281 23.8281L31.5156 31.5156'
        stroke='#A5A39C'
        strokeWidth='3.84375'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M14.2188 26.3906C20.9411 26.3906 26.3906 20.9411 26.3906 14.2188C26.3906 7.49641 20.9411 2.04688 14.2188 2.04688C7.49641 2.04688 2.04688 7.49641 2.04688 14.2188C2.04688 20.9411 7.49641 26.3906 14.2188 26.3906Z'
        stroke='#A5A39C'
        strokeWidth='3.84375'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default Search
