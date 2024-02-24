const sounds = [
    new Audio('/key1.mp3'),
    new Audio('/key2.mp3'),
    new Audio('/key3.mp3')

]

const delays = [0.072, 0.158, 0.258];

let index = 0;

export default () => {
    const i = index++ % 3;
    const toPlay = sounds[i];
    const delay = delays[i];
    toPlay.currentTime = delay;
    toPlay.play()
    console.log(i, delay);
}