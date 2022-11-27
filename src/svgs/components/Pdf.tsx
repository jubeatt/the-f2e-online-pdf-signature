interface Props {
  className?: string
}

const Pdf: React.FC<Props> = (props) => {
  return (
    <svg
      className={props.className ?? ''}
      width='144'
      height='144'
      viewBox='0 0 144 144'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M135 81V72H108V117H117V99H130.5V90H117V81H135ZM85.5 117H67.5V72H85.5C89.0793 72.0036 92.511 73.427 95.042 75.958C97.573 78.489 98.9964 81.9207 99 85.5V103.5C98.9964 107.079 97.573 110.511 95.042 113.042C92.511 115.573 89.0793 116.996 85.5 117ZM76.5 108H85.5C86.6931 107.999 87.837 107.524 88.6807 106.681C89.5243 105.837 89.9988 104.693 90 103.5V85.5C89.9988 84.3069 89.5243 83.163 88.6807 82.3193C87.837 81.4757 86.6931 81.0012 85.5 81H76.5V108ZM49.5 72H27V117H36V103.5H49.5C51.8859 103.496 54.173 102.547 55.86 100.86C57.5471 99.173 58.4964 96.8859 58.5 94.5V81C58.4976 78.6138 57.5486 76.326 55.8613 74.6387C54.174 72.9514 51.8862 72.0024 49.5 72ZM36 94.5V81H49.5L49.5045 94.5H36Z'
        fill='#A5A39C'
      />
      <path
        d='M99 62.9999V44.9999C99.0159 44.4085 98.9034 43.8206 98.6704 43.2769C98.4373 42.7331 98.0892 42.2463 97.65 41.8499L66.15 10.3499C65.7538 9.91043 65.267 9.56216 64.7232 9.32909C64.1794 9.09602 63.5914 8.9837 63 8.99988H18C15.6152 9.007 13.3302 9.9575 11.6439 11.6438C9.95762 13.3301 9.00712 15.6151 9 17.9999V126C9 128.387 9.94821 130.676 11.636 132.364C13.3239 134.052 15.6131 135 18 135H90V126H18V17.9999H54V44.9999C54.0071 47.3846 54.9576 49.6697 56.6439 51.356C58.3302 53.0423 60.6152 53.9928 63 53.9999H90V62.9999H99ZM63 44.9999V19.7999L88.2 44.9999H63Z'
        fill='#A5A39C'
      />
    </svg>
  )
}

export default Pdf