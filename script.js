let model, webcam, labelContainer, maxPredictions;

async function init() {
    const URL = "./"; 
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new new Webcam(400, 300, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let highestProbability = 0;
    let predictedClass = "";

    prediction.forEach((pred) => {
        if (pred.probability > highestProbability) {
            highestProbability = pred.probability;
            predictedClass = pred.className;
        }
    });

    document.getElementById("prediction-result").innerText = `Prediction: ${predictedClass} (${(highestProbability * 100).toFixed(2)}%)`;
}

document.getElementById("predict-button").addEventListener("click", predict);

init();