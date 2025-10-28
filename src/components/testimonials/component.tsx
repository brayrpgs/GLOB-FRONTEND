import { useRef, useState } from 'react'
import styles from '../../styles/testimonials/styles.module.css'
const component: React.FC = () => {
  const testimonials = [
    {
      text: 'I was very satisfied with the service. From the first contact the team understood our needs and delivered a functional, aesthetically pleasing solution on time. Clear communication, attentive support, and results that exceeded expectations. Highly recommended.',
      name: 'Maria López',
      avatar: '/testi-1.png'
    },
    {
      text: 'The team provided exceptional service from start to finish. They were attentive to our requirements, communicated clearly throughout the process, and delivered a high-quality solution that met our needs perfectly. I highly recommend their services to anyone looking for reliable and professional support.',
      name: 'Pedro Fernández',
      avatar: '/testi-2.png'
    },
    {
      text: 'From the initial consultation to the final delivery, the team demonstrated professionalism and expertise. They listened carefully to our needs, provided valuable insights, and executed the project flawlessly. The end result exceeded our expectations, and we are extremely satisfied with the outcome.',
      name: 'Carlos Martínez',
      avatar: '/testi-3.png'
    }
  ]
  const testiRef = useRef<HTMLDivElement>(null)

  // Handle testimonial navigation with fade animations
  const handleButtons = (direction: number): void => {
    if ((index + direction > 2) || (index + direction < 0)) return
    testiRef.current?.classList.add(styles.exitFade)
    setTimeout(() => {
      setIndex(index + direction)
      testiRef.current?.classList.replace(styles.exitFade, styles.enterFade)
    }, 1000)
    testiRef.current?.classList.remove(styles.enterFade)
  }

  const [index, setIndex] = useState<number>(0)
  return (
    <div ref={testiRef} className={styles.container}>
      <div className={styles.arrows} onClick={() => { handleButtons(-1) }}>&#8678;</div>
      <div className={styles.content}>
        <h2 className={styles.title}>what our coustomes have to say</h2>
        <p className={styles.text}>
          "{testimonials[index].text}"
        </p>
        <p className={`${styles.name} ${styles.text}`}> {testimonials[index].name} </p>
        <div className={styles.avatars}>
          <img className='' src='/testi-1.png' alt='testimonials-1' />
          <img className='' src='/testi-2.png' alt='testimonials-2' />
          <img className='' src='/testi-3.png' alt='testimonials-3' />
        </div>
        <img className={styles.testi} src={testimonials[index].avatar} alt='' />
      </div>
      <div className={styles.arrows} onClick={() => { handleButtons(1) }}>&#8680;</div>
    </div>
  )
}

export { component }
