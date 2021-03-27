// import "./styles.css";
import { useEffect, useState } from "react";
import p5 from "react-p5";
import Sketch from "react-p5";
import axios from 'axios';
import './index.css'
//import { PanZoom } from 'react-easy-panzoom'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const hexRgb = require('hex-rgb');

var palette = [
  '#400000', '#400000', '#400900', '#234000', '#004000', '#004000', '#004000',
  '#000d40', '#000040', '#000040', '#000040', '#000040', '#280040', '#400003',
  '#400000', '#000000', '#540000', '#540000', '#541d00', '#375400', '#005400',
  '#005400', '#005402', '#002154', '#000054', '#000054', '#000054', '#000054',
  '#3c0054', '#540017', '#540000', '#0d0d0d', '#680000', '#680000', '#683100',
  '#4b6800', '#006800', '#006800', '#006816', '#003568', '#001168', '#000068',
  '#000068', '#000068', '#500068', '#68002b', '#680000', '#212121', '#7c0000',
  '#7c0000', '#7c4500', '#5f7c00', '#0b7c00', '#007c00', '#007c2a', '#00497c',
  '#00257c', '#00007c', '#00007c', '#10007c', '#64007c', '#7c003f', '#7c0000',
  '#353535', '#900000', '#900400', '#905900', '#739000', '#1f9000', '#009000',
  '#00903e', '#005d90', '#003990', '#000090', '#000090', '#240090', '#780090',
  '#900053', '#900000', '#494949', '#a40000', '#a41800', '#a46d00', '#87a400',
  '#33a400', '#00a400', '#00a452', '#0071a4', '#004da4', '#0000a4', '#0000a4',
  '#3800a4', '#8c00a4', '#a40067', '#a40013', '#5d5d5d', '#b80000', '#b82c00',
  '#b88100', '#9bb800', '#47b800', '#00b800', '#00b866', '#0085b8', '#0061b8',
  '#000db8', '#0000b8', '#4c00b8', '#a000b8', '#b8007b', '#b80027', '#717171',
  '#cc0000', '#cc4000', '#cc9500', '#afcc00', '#5bcc00', '#06cc00', '#00cc7a',
  '#0099cc', '#0075cc', '#0021cc', '#0c00cc', '#6000cc', '#b400cc', '#cc008f',
  '#cc003b', '#858585', '#e00000', '#e05400', '#e0a900', '#c3e000', '#6fe000',
  '#1ae000', '#00e08e', '#00ade0', '#0089e0', '#0035e0', '#2000e0', '#7400e0',
  '#c800e0', '#e000a3', '#e0004f', '#999999', '#f41414', '#f46814', '#f4bd14',
  '#d7f414', '#83f414', '#2ef414', '#14f4a2', '#14c1f4', '#149df4', '#1449f4',
  '#3414f4', '#8814f4', '#dc14f4', '#f414b7', '#f41463', '#adadad', '#ff2828',
  '#ff7c28', '#ffd128', '#ebff28', '#97ff28', '#42ff28', '#28ffb6', '#28d5ff',
  '#28b1ff', '#285dff', '#4828ff', '#9c28ff', '#f028ff', '#ff28cb', '#ff2877',
  '#c1c1c1', '#ff3c3c', '#ff903c', '#ffe53c', '#ffff3c', '#abff3c', '#56ff3c',
  '#3cffca', '#3ce9ff', '#3cc5ff', '#3c71ff', '#5c3cff', '#b03cff', '#ff3cff',
  '#ff3cdf', '#ff3c8b', '#d5d5d5', '#ff5050', '#ffa450', '#fff950', '#ffff50',
  '#bfff50', '#6aff50', '#50ffde', '#50fdff', '#50d9ff', '#5085ff', '#7050ff',
  '#c450ff', '#ff50ff', '#ff50f3', '#ff509f', '#e9e9e9', '#ff6464', '#ffb864',
  '#ffff64', '#ffff64', '#d3ff64', '#7eff64', '#64fff2', '#64ffff', '#64edff',
  '#6499ff', '#8464ff', '#d864ff', '#ff64ff', '#ff64ff', '#ff64b3', '#fdfdfd',
  '#ff7878', '#ffcc78', '#ffff78', '#ffff78', '#e7ff78', '#92ff78', '#78ffff',
  '#78ffff', '#78ffff', '#78adff', '#9878ff', '#ec78ff', '#ff78ff', '#ff78ff',
  '#ff78c7', '#ffffff', '#ff8c8c', '#ffe08c', '#ffff8c', '#ffff8c', '#fbff8c',
  '#a6ff8c', '#8cffff', '#8cffff', '#8cffff', '#8cc1ff', '#ac8cff', '#ff8cff',
  '#ff8cff', '#ff8cff', '#ff8cdb', '#ffffff'
]

export default function App() {
  let colorPicker;
  let sel;
  let size = 5;
  const height = 1000;
  const width = 1000;
  var img;
  var w, h, tow, toh;
  var x, y, tox, toy;
  var zoom = 1.00;
  // var zoom = 0.01;
  var zMin = 0.05;
  var zMax = 13.00;
  var sens = 0.01;
  var pg;

  
  

  const preload = (p5) => {
    img = p5.createImage(1000, 1000); 
  }

  const setup = (p5, canvasParentRef) => {

    
    //let img = p5.createImage(1000, 1000); 
    sel = p5.createSelect();
    sel.position(1010, 10);
    sel.option('1px');
    sel.option('5px');
    sel.option('10px');
    sel.selected('5px');
    sel.changed(mySelectEvent);

    img.loadPixels();
    p5.createCanvas(1000, 1000).parent(canvasParentRef);
    // w = tow = img.width;
    // h = toh = img.height;
    // x = tox = w / 2;
    // y = toy = h / 2;

    pg = p5.createGraphics(1000, 1000);
    p5.background(0);

    colorPicker = p5.createColorPicker("#ed225d");
    colorPicker.position(1010, 50);

    function mySelectEvent() {
      let size_str = sel.value();
      size_str = size_str.slice(0, -2)
      size = parseInt(size_str)
    }

    function writeColor(image, x, y, red, green, blue, alpha) {
      let index = (x + y * width) * 4;
      // index = index*4
      image.pixels[index] = red;
      image.pixels[index + 1] = green;
      image.pixels[index + 2] = blue;
      image.pixels[index + 3] = 255;
    }

    // console.log(img.pixels);

    // get pixels from redis database
    async function updatePixelsDB() {

      var res = await axios.get('https://canvas-api-test2.herokuapp.com/api/getboard');
      console.log('loadedbits')
      var array = res.data.toString().split("\\x");
      array.splice(0, 1);
      
      let decimal = parseInt(array[0], 16);

      
      for (let i = 0; i < 1000000; i++) {
        let index = i;
        let colorindex = parseInt(array[i], 16);
        let color = hexRgb(palette[colorindex])
        writeColor(img, index, color.red, color.green, color.blue, 255);
      }
      

      img.updatePixels();
    }

    let x, y;
    // fill with random colors
    for (y = 0; y < img.height; y++) {
      for (x = 0; x < img.width; x++) {
        let red = p5.random(255);
        let green = p5.random(255);
        let blue = p5.random(255);
        let alpha = 255;
        writeColor(img, x, y, red, green, blue, alpha);
      }
    }

    img.updatePixels();
    // updatePixelsDB()

    
    // p5.scale(zoom)
    // p5.noSmooth()
    
    // p5.image(img, 0, 0);

  };

  const draw = (p5) => {

    // x = p5.lerp(x, tox, .1);
    // y = p5.lerp(y, toy, .1);
    // w = p5.lerp(w, tow, .1); 
    // h = p5.lerp(h, toh, .1);

    // p5.noSmooth()
    // p5.image(img, x-w/2, y-h/2, w, h);
    // p5.translate(p5.width/2,p5.height/2);
    //p5.translate(p5.mouseX, p5.mouseY);
    
    p5.scale(zoom);
    //p5.translate(p5.mouseX, p5.mouseY);
    p5.noSmooth()
    p5.image(img, 0, 0);
    // p5.fill(255);
    // p5.rect(25, 25, 50, 50);
    p5.image(pg, 0, 0);
    // for (let i = 0; i < 200; i++) {
    //   for (let j = 0; j < 200; j++) {
    //     p5.background.set(i, j, p5.color(0, 90, 102));
    //   }
    // }
  };
  
  const mouseClicked = (p5, event) => {
    console.log(event);
    let color = colorPicker.color();

    pg.noStroke();
    pg.noSmooth();
    pg.fill(color);
    pg.rect(p5.round(p5.mouseX/zoom), p5.round(p5.mouseY/zoom), size, size);
    // pg.rect(p5.mouseX, p5.mouseY, size, size);
    // let black = p5.color(0);
    // img.loadPixels();
    // p5.set(p5.mouseX, p5.mouseY, black);
    // img.updatePixels();

    return false;
  };

  const touchMoved =(p5, event) => {
    //console.log(event);
    // tox += p5.mouseX-p5.pmouseX;
    // toy += p5.mouseY-p5.pmouseY;
    let color = colorPicker.color();
    pg.noStroke();
    pg.noSmooth();
    pg.fill(color);
    pg.rect(p5.round(p5.mouseX/zoom), p5.round(p5.mouseY/zoom), size, size);
    return false;
  }


  const mouseWheel = (p5, event) => {
    // console.log(event);
    // var e = -event.delta;

    // if (e>0) { //zoom in
    //   for (var i=0; i<e; i++) {
    //     if (tow>30*width) return; //max zoom
    //     tox -= zoom * (p5.mouseX - tox);
    //     toy -= zoom * (p5.mouseY - toy);
    //     tow *= zoom+1;
    //     toh *= zoom+1;
    //   }
    // }
    
    // if (e<0) { //zoom out
    //   for (var i=0; i<-e; i++) {
    //     if (tow<width) return; //min zoom
    //     tox += zoom/(zoom+1) * (p5.mouseX - tox); 
    //     toy += zoom/(zoom+1) * (p5.mouseY - toy);
    //     toh /= zoom+1;
    //     tow /= zoom+1;
    //   }
    // }
    zoom -= sens * event.delta;
    zoom = p5.constrain(zoom, zMin, zMax);
    
    console.log(zoom)
    return false;

  }


  return(

    <Sketch mouseClicked={mouseClicked} mouseWheel = {mouseWheel} touchMoved = {touchMoved} preload = {preload} setup={setup} draw={draw} />

  )
} 

// className="container">