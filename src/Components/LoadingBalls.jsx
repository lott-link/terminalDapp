import styles from './LoadingBalls.module.css';
const LoadingBalls = (props)=>{
    return (
      <div className='d-flex justify-content-center align-items-center mx-2' {...props}>
        <div className={styles.growCircle}></div>
        <div className={styles.shrinkCircle}></div>
        <div className={styles.growCircle}></div>
      </div>
    )
}
export default LoadingBalls;