export default ({ min = 0, max = 1024, round = 1} : {
    min?: number,
    max?: number,
    round?: number
} = {}) => (~~(((Math.random() * (min + max)) - min) * round)) / round;