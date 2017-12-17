import { Drawable } from './drawable.js';
import { Snowflake } from "./snowflake.js";
import SnowflakeImage from './resources/snowflake.png';

var d = new Drawable(5,2);

var images = {
    "snowflake": new Image(),
    "santa": new Image(),
    "snowman": new Image()
};
images["snowflake"].src = SnowflakeImage;

var s = new Snowflake(0, 0, images["snowflake"]);

function init () {
    // Create objects
    // Create different sized snowflakes! The closer the snowflake,
    // the larger it should be and the faster it should be moving.
    // This should produce a better effect.
}