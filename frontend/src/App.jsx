import { useEffect, useState } from 'react';
import { WindowSetSize, WindowSetAlwaysOnTop } from "../wailsjs/runtime/runtime"
import { Terminate } from "../wailsjs/go/main/App";

import { Grid2, Tooltip } from '@mui/material';

import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import IconButton from '@mui/material/IconButton';
import SwitchVideoIcon from '@mui/icons-material/SwitchVideo';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import Forward30Icon from '@mui/icons-material/Forward30';
import Forward10Icon from '@mui/icons-material/Forward10';
import Forward5Icon from '@mui/icons-material/Forward5';
import PanToolIcon from '@mui/icons-material/PanTool';
import PushPinIcon from '@mui/icons-material/PushPin';
import CloseIcon from '@mui/icons-material/Close';

import './App.css';
/**
 * Rotate Application
 * 
 * Rotate(Zoom) the screen and display it.
 * @returns Application Component
 */
function App() {

  const [degree, setDegree] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [videoStyle, setVideoStyle] = useState({});

  const [showMenu, setShowMenu] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [pinMode, setPinMode] = useState(false);

  const [message, setMessage] = useState("");

  const displayMediaOptions = {
    video: {
      displaySurface: "browser",
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  };

  /**
   * Caputure Screen
   * @param {*} displayMediaOptions 
   * @returns 
   */
  const startCapture = async (displayMediaOptions) => {
    return navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
      .catch((err) => {
        console.error("Error: " + err);
        setErrorMessage(err)
        return null
      });
  }

  /**
   * Stop Capture
   * @returns 
   */
  const stopCapture = async () => {
    const elm = document.getElementById('video');
    if (elm.srcObject === null) {
      return;
    }
    let tracks = elm.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    elm.srcObject = null;
  }

  /**
   * initialize
   */
  useEffect(() => {

    const elm = document.getElementById('video');
    elm.onpointermove = function (event) {
      if (event.buttons) {
        this.style.left = this.offsetLeft + event.movementX + 'px'
        this.style.top = this.offsetTop + event.movementY + 'px'
        this.style.position = 'absolute'
        this.draggable = false
      }
    }

  }, []);

  /**
   * SpaceIcon
   * @param {Number} scale : space width
   * @returns space 
   */
  const SpaceIcon = ({ scale }) => {
    return <div style={{ width: scale === undefined ? 24 : (24 * scale) }} />;
  }

  /**
   * setWindowSize
   * @param {*} width 
   * @param {*} height 
   * @returns 
   */
  const setWindowSize = (width, height) => {

    if (degree % 90 !== 0) {
      return;
    }

    var w = width;
    var h = height;

    const elm = document.getElementById('video');
    elm.style.left = "0";
    elm.style.top = "0";

    WindowSetSize(w, h);
  }

  /**
   * switch display
   */
  const handleSwitchDisplay = () => {
    const elm = document.getElementById('video');
    startCapture(displayMediaOptions).then((stream) => {

      if ( stream === null ) {
        setErrorMessage("Could not capture the screen");
        return;
      }

      stopCapture();

      const tracks = stream.getVideoTracks();
      const videoTrack = tracks[0];
      videoTrack.onended = () => {
        setErrorMessage("The screen has stopped");
        elm.srcObject = null;
      };

      //reset vide size
      createVideoStyle(0, 1.0);

      elm.srcObject = stream;

      elm.addEventListener('canplay', (e) => {
        const width = elm.videoWidth;
        const height = elm.videoHeight;
        setWindowSize(width, height);
      });

    }).catch((err) => {
      console.error("Error: ", err);
      setErrorMessage(err);
    });
  }

  /**
   * Create Video Style
   * @param {Number} deg defgree
   * @param {Number} zoom zoom
   */
  const createVideoStyle = (deg, zoom) => {

    const style = Object.assign({}, videoStyle);
    style.transform = `rotate(${deg}deg) scale(${zoom})`;

    setDegree(deg);
    setZoom(zoom);
    setVideoStyle(style);
  }

  /**
   * Show Menu
   * 
   * Display in the upper area
   * @param {*} e 
   */
  const handleShowMenu = (e) => {
    if (e.clientY < 64) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  }

  /**
   * push rotate button
   * 
   * Changes of 90 degrees should be multiples of 90
   * @param {Number} deg degree
   */
  const handleRotate = (deg) => {

    var now = degree + deg;

    if (deg === 90) {
      if (now >= 360) {
        now = 360;
      } else if (now >= 270) {
        now = 270;
      } else if (now >= 180) {
        now = 180;
      } else if (now >= 90) {
        now = 90;
      }
    }

    if (now % 360 === 0) {
      now = 0;
    }

    createVideoStyle(now, zoom);
  }

  /**
   * Zoom in/out(Mouse wheel)
   * @param {*} e 
   */
  const handleZoom = (e) => {
    var now = 0.0;
    if (e.deltaY < 0) {
      now = zoom + 0.1;
    } else {
      now = zoom - 0.1;
      if ( now < 0.1 ) {
        now = 0.1;
      }
    }
    createVideoStyle(degree, now);
  };

  /**
   * Switch edit mode
   */
  const handleSwitchMode = () => {
    setEditMode(!editMode);
  }

  /**
   * Switch always on top
   * @param {*} e 
   */
  const handleSwitchPin = (e) => {
    var val = !pinMode;
    WindowSetAlwaysOnTop(val);
    setPinMode(val);
  }

  /**
   * Slide Transition
   * @param {object} props 
   * @returns Slide Transition Component
   */
  const SlideTransition = (props) => {
    return <Slide {...props} direction="left" />;
  }

  /**
   * Set Error Message
   * @param {*} e 
   */
  const setErrorMessage = (e) => {
    if ( e !== null && typeof e === 'object' ) {
      setMessage(e.message);
      setEditMode(false);
    } else if ( e !== "" )  {
      setMessage(e);
      setEditMode(false);
    } else {
      setMessage(e);
    }
  }

  /**
   * Clear Message()
   * @param {*} e 
   */
  const handleCloseMessage = (e) => {
    setErrorMessage("");
  }

  /**
   * Terminate the application
   */
  const handleClose = () => {
    stopCapture();
    Terminate().then(() => {
    }).catch((err) => {
      console.error("Error: ", err);
      setErrorMessage(err);
    });
  }

  var pinColor = pinMode ? "success" : "normal";
  var panColor = editMode ? "success" : "normal";
  var menuClass = (showMenu ? "show" : "hide");

  return (
    <div id="App" onMouseMove={handleShowMenu}>

      {!editMode &&
        <div id="videoLayer" />
      }
      <Grid2 id="systemMenu" container spacing={2} className={menuClass}>

        <Grid2 id="leftMenu" size={{ xs: 6, md: 8 }}>
<Tooltip title="Select Display">
          <IconButton edge="start" color="inherit" aria-label="aspect" sx={{ mr: 2 }} onClick={handleSwitchDisplay}>
            <SwitchVideoIcon size="large" />
          </IconButton>
</Tooltip>

          <SpaceIcon />

<Tooltip title="Rotate 90">
          <IconButton edge="start" color="inherit" aria-label="rotate90" sx={{ mr: 2 }} onClick={() => handleRotate(90)}>
            <Rotate90DegreesCwIcon size="large" />
          </IconButton>
</Tooltip>
<Tooltip title="Rotate 30">
          <IconButton edge="start" color="inherit" aria-label="rotate30" sx={{ mr: 2 }} onClick={() => handleRotate(30)}>
            <Forward30Icon size="large" />
          </IconButton>
          </Tooltip>
<Tooltip title="Rotate 10">
          <IconButton edge="start" color="inherit" aria-label="rotate10" sx={{ mr: 2 }} onClick={() => handleRotate(10)}>
            <Forward10Icon size="large" />
          </IconButton>
          </Tooltip>
<Tooltip title="Rotate 5">
          <IconButton edge="start" color="inherit" aria-label="rotate5" sx={{ mr: 2 }} onClick={() => handleRotate(5)}>
            <Forward5Icon size="large" />
          </IconButton>
          </Tooltip>

          <SpaceIcon />

<Tooltip title="Edit Mode">
          <IconButton edge="start" color="inherit" aria-label="aspect" sx={{ mr: 2 }} onClick={handleSwitchMode}>
            <PanToolIcon size="large" color={panColor} />
          </IconButton>
</Tooltip>
        </Grid2>

        <Grid2 id="rightMenu" size={{ xs: 6, md: 4 }}>
<Tooltip title="Always On Top">
          <IconButton edge="start" color="inherit" aria-label="aspect" sx={{ mr: 2 }} onClick={handleSwitchPin}>
            <PushPinIcon size="large" color={pinColor} />
          </IconButton>
</Tooltip>

          <SpaceIcon />

<Tooltip title="Close Application">
          <IconButton edge="start" color="inherit" aria-label="close" sx={{ mr: 2 }} onClick={handleClose}>
            <CloseIcon size="large" />
          </IconButton>
</Tooltip>

        </Grid2>

      </Grid2>

      <video id="video" autoPlay style={videoStyle} onWheel={handleZoom}></video>

      <Snackbar id="messageBar"
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={message !== ""}>

        <Alert
          onClose={handleCloseMessage}
          severity="error"
          variant="filled">
          {message}
        </Alert>
      </Snackbar>

    </div>
  )
}

export default App
