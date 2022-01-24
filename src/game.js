{
    const image = new Image(),
        takePhotoButton = document.querySelector('.takePhoto');

    let constraints, imageCapture, mediaStream, video;

    // variables 
    const markers = document.querySelectorAll(`a-marker`),
        numCol = 3, 
        numRow = 3, 
        puzzlePieces = numCol * numRow, 
        tolerance = 1.9;
    
    let imgPieces = new Array(puzzlePieces),
        puzzle = [...Array(puzzlePieces).keys()].map(String),
        pieces = numCol * numRow - 1,
        positionMarkers = [],
        check = new Array(6);

    const init = () => {
        video = document.querySelector('video')
        navigator.mediaDevices.enumerateDevices()
            .then(getStream)
            .catch(error => console.log('enumerateDevices error!', error));

        takePhotoButton.addEventListener(`click`, getPicture);

    };

    // get video stream from the camera
    const getStream = () => {
        if (mediaStream) {
            mediaStream.getTracks.forEach(track => track.stop());
        };

        constraints = {
            video: {
                width: 720,
                height: 720,
            }
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotStream)
            .catch(error => console.log('getUserMedia error!', error))
    };
    // display the camera stream and creates the captured img object from the stram
    const gotStream = stream => {
        mediaStream = stream;
        video.srcObject = stream;
        imageCapture = new imageCapture(stream.getVideoTracks()[0]);
    };
    // method to take the picture
    const getPicture = () => {
        imageCapture.takePhoto()
            .then((img) => {
                image.src = URL.createObjectURL(img);
                image.addEventListener('load', () => createImagePieces(image));
                setInterval(() => checkDistance(), 1000);
                console.log(puzzle);
            })
            .catch(error => console.log('takePhoto error!', error));
    };
    // method to split the static image 
    const createImagePieces = image => {
        const canvas = document.createElement(`canvas`);
        const ctx = canvas.getContext('2d');
        const pieceWidth = image.width / numCol;
        const pieceHeight = image.height / numRow;

        for (let x = 0; x < numCol; x++) {
            for (let y =0; y < numRow; y++) {
                ctx.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);
                imgPieces[8-pieces] = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                console.log(imgPieces);
                pieces = pieces - 3;
                if (pieces < 0) {
                    pieces = (puzzlePieces - 1) + pieces;
                };
            };
        };
        markers.forEach((marker, i) => {
            const aImg = document.createElement(`a-image`);
            aImg.setAttribute(`rotation`, `-90 0 0`);
            aImg.setAttribute(`position`, `0 0 0`);
            aImg.setAttribute(`src`, imgPieces[puzzle[i]]);

            marker.appendChild(aImg);

        });

    };
}