const k = document.getElementById("k-value");
const submitBtn = document.getElementById("submit-btn");
const clearBtn = document.getElementById("clear-btn");
const animationBox = document.getElementById("animation-box");
const homeNavBtn = document.getElementById("home");
const technologiesNavBtn = document.getElementById("technologies");
const homeContent = document.getElementById("home-content");
const technologiesContent = document.getElementById("technologies-content");

// -------------------------- Validation --------------------------

const validateKValue = () => {
    const kValue = parseInt(Number(k.value));
    const errorMsg = document.querySelector('.err-msg');

    if(kValue >= 1 && kValue <= 8){
        errorMsg.classList.add("hidden");
        return true;
    }else{
        errorMsg.classList.remove("hidden");
        return false;
    }
}

// -------------------------- Button Control --------------------------

const showClearBtn = () => {
    clearBtn.classList.remove("hidden");
}


const hideClearBtn = () => {
    clearBtn.classList.add("hidden");
}


const clearAnimationBox = () => {
    while (animationBox.firstChild) {
        animationBox.removeChild(animationBox.firstChild);
    }
    hideClearBtn();
}

// -------------------------- Canvas Control --------------------------

const createCanvasElement = () => {
    
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    const canvas = document.createElement('canvas');
    
    canvas.style.width = 0.5*vw + "px";
    canvas.style.height = 400 + "px";
    canvas.width = 0.5*vw;
    canvas.height = 400;
    canvas.classList.add("animation");

    animationBox.appendChild(canvas);

    return canvas;
}

// -------------------------- Web Worker Control --------------------------

const animate = () => {
    if(validateKValue()){
        const canvas = createCanvasElement();
        showClearBtn();
        
        let offscreen = canvas.transferControlToOffscreen();

        let worker = new Worker("worker.js");
        worker.postMessage({canvas : offscreen, k : parseInt(k.value)}, [offscreen]);
    }
}

// button listeners 
submitBtn.addEventListener('click', animate);
clearBtn.addEventListener('click', clearAnimationBox);

homeNavBtn.addEventListener('click', () => {
    homeContent.classList.remove("hidden");
    technologiesContent.classList.add("hidden");
});

technologiesNavBtn.addEventListener('click', () => {
    homeContent.classList.add("hidden");
    technologiesContent.classList.remove("hidden");
})
