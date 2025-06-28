
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import './ImageCropper.css';

export default function ImageCropper({ imageSrc, onCancel, onCropComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropCompleteInternal = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
// console.log("ImageCropper", imageSrc, onCancel, onCropComplete);
    const handleCrop = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
    };

    return (
        <div className="cropper-container">
            <div className="cropper">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // square crop
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropCompleteInternal}
                />
            </div>
            <div className="cropper-controls">
                <button onClick={onCancel}>Cancel</button>
                <button onClick={handleCrop}>Crop & Upload</button>
            </div>
        </div>
    );
}
