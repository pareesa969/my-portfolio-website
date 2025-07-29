const canvas = document.getElementById('notepad');
const ctx = canvas.getContext('2d');

let drawing = false;
let currentColor = 'black';
let currentSize = 2;
let erasing = false;
let currentShape = 'free';

let startX = 0, startY = 0;
let savedImage = null;

let history = [];
let redoHistory = [];

// Event listeners
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDraw);
canvas.addEventListener('mouseout', stopDraw);

function startDraw(e) {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
  savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (currentShape === 'free') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }
}

function draw(e) {
  if (!drawing) return;

  const endX = e.offsetX;
  const endY = e.offsetY;

  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = erasing ? '#fff' : currentColor;

  if (currentShape === 'free') {
    ctx.lineTo(endX, endY);
    ctx.stroke();
  } else {
    ctx.putImageData(savedImage, 0, 0); // restore before drawing shape

    if (currentShape === 'rectangle') {
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    } else if (currentShape === 'circle') {
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (currentShape === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
}

function stopDraw(e) {
  if (!drawing) return;
  drawing = false;

  if (currentShape !== 'free') {
    draw(e); // draw final shape
  }

  saveState();
}

function setColor(color) {
  currentColor = color;
  erasing = false;
}

function setEraser() {
  erasing = true;
  currentShape = 'free'; // eraser only in free mode
}

function setSize(size) {
  currentSize = size;
}

function setShape(shape) {
  currentShape = shape;
  erasing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  saveState();
}

function saveState() {
  history.push(canvas.toDataURL());
  redoHistory = []; // clear redo on new action
}

function undo() {
  if (history.length > 1) {
    redoHistory.push(history.pop());
    restoreState(history[history.length - 1]);
  }
}

function redo() {
  if (redoHistory.length > 0) {
    const dataUrl = redoHistory.pop();
    history.push(dataUrl);
    restoreState(dataUrl);
  }
}

function restoreState(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

function downloadCanvas() {
  const link = document.createElement('a');
  link.download = 'roughwork.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ✅ Initialize first blank state
saveState();
