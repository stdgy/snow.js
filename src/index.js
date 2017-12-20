import { Snowflake } from "./snowflake.js";
import SnowflakeImage from './resources/snowflake.png';
import 'jquery/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.min.css';
//require('bootstrap');

let snowingModule = (function () {
    let snowflakes = [];
    let canvas = null;
    let ctx = null;
    let drawSnow = true;

    function calculateDistributionsPerDepth (total, depths)
    {
        // exponential distribution across depths
        // total = x + 2x + 4x + 8x... + 2^(d-1)x
        let x = depths
            .map( val => Math.pow(2, val))
            .reduce( (previous, current) => (previous + current) );
        
        x = total / x;
        
        return depths.map( val => ({ "depth": val, "numFlakes": Math.ceil(Math.pow(2, val) * x) }));
    }

    function createSnowFlakes (flakesByDepth, maxHeight, maxWidth)
    {
        return flakesByDepth
            .map( item => {
                let flakes = [];
                let image = new Image();
                image.src = SnowflakeImage;
                image.height = Math.ceil(20/item.depth);
                image.width = Math.ceil(20/item.depth);

                for (let i = 0; i < item.numFlakes; i++) {
                    flakes.push(new Snowflake(
                        Math.floor(Math.random()*maxWidth),
                        Math.floor(Math.random()*maxHeight),
                        image,
                        item.depth
                    ));
                }
                return flakes;
            })
            .reduce((prev, curr) => (prev.concat(curr)));
    }

    function doWeShowSnow () {
        let showSnow = true;

        try {
            let storedData = JSON.parse(localStorage.getItem("christmify"));
            
            if (storedData)
            {
                showSnow = storedData["showSnow"] ? true : false;
            }
        } catch (error) {
            showSnow = true;
        }

        return showSnow;
    }

    function setNoSnow () {
        try {
            drawSnow = false;
            localStorage.setItem("christmify",
                JSON.stringify({ "showSnow": false }));
        } catch (error) {
            
        }
    }

    function setSnow () {
        try {
            drawSnow = true;
            localStorage.setItem("christmify",
                JSON.stringify({ "showSnow": true }));
        } catch (error) {
            
        }
    }

    function getButtonText () {
        let text = null;

        if (doWeShowSnow())
        {
            text = "BAH HUMBUG";
        } else {
            text = "I <3 Snow";
        }

        return text;
    }

    function createOptions () {
        let button = document.createElement('div');
        
        button.innerText = getButtonText();
        button.style.position = 'absolute';
        button.style.backgroundColor = 'red';
        button.style.border = '5px solid green';
        button.style.top = '25px';
        button.style.right = '80px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', event => {
            if (button.innerText === "BAH HUMBUG"){
                setNoSnow();
            } else {
                setSnow();
                window.requestAnimationFrame(draw);
            }

            button.innerText = getButtonText();
        });

        document.body.appendChild(button);
    }

    function createCanvas ()
    {
        var canvas = document.createElement('canvas');
        canvas.id = 'war-on-christmas-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.right = '0px';
        canvas.style.bottom = '0px';
        canvas.style.left = '0px';
        canvas.style.zIndex = '-1';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);

        return canvas;
    }

    function init () {
        // Create objects
        // Create different sized snowflakes! The closer the snowflake,
        // the larger it should be and the faster it should be moving.
        // This should produce a better effect.

        createOptions();


        let n = 500; // total # snowflakes
        let depths = [1,2,3,4];
        let distribution = calculateDistributionsPerDepth(n, depths);
        canvas = createCanvas();

        // Don't bother loading the canvas if there is no support
        if (canvas.getContext)
        {
            ctx = canvas.getContext('2d');
            snowflakes = createSnowFlakes(distribution, canvas.height, canvas.width);

            if (doWeShowSnow()){
                window.requestAnimationFrame(draw);
            }
        }
    }

    function draw () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snowflakes.forEach(snowflake => {
            ctx.drawImage(snowflake.image, 
                snowflake.x % canvas.width, snowflake.y % canvas.height,
                snowflake.image.width, snowflake.image.height);
            snowflake.updatePosition();
        });

        if (drawSnow){
            window.requestAnimationFrame(draw);
        } else {
            // Must have been asked to stop, so clear it all.
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return {
        "init": init
    };
})();

document.addEventListener('DOMContentLoaded', snowingModule.init);