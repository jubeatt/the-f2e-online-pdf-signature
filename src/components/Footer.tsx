import cx from 'classnames'

interface FooterProps {
  phase: number
  children: React.ReactNode
}

const progressTexts = ['上傳文件', '進行簽署', '下載文件']
const progressDots = ['dot-1', 'dot-2', 'dot-3']

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <div className='f2e-layout-footer'>
      <div className='f2e-layout-footer-container'>
        <div className='f2e-layout-footer-progress'>
          <div className='f2e-layout-footer-progress-texts'>
            {progressTexts.map((text, index) => (
              <div
                key={text}
                className={cx(
                  'f2e-layout-footer-progress-title',
                  { 'in-progess': index === props.phase },
                  { 'in-progess-before': index < props.phase }
                )}
              >
                {text}
              </div>
            ))}
          </div>
          <div className={`f2e-layout-footer-progress-bar phase-${props.phase}`}>
            {progressDots.map((dot, index) => (
              <div
                key={dot}
                className={cx(
                  `f2e-layout-footer-progress-bar-dot ${dot}`,
                  { 'in-progress': index === props.phase },
                  { 'in-progess-before': index < props.phase }
                )}
              ></div>
            ))}
          </div>
        </div>
        <div className='f2e-layout-footer-operations'>{props.children}</div>
      </div>
    </div>
  )
}

export default Footer
