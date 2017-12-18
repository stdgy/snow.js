import { Drawable } from "./drawable";

class Snowflake extends Drawable {
    constructor(x, y, image, depth) {
        super(x, y);
        this.image = image;

        let d = depth ? depth : 1;
        let v = 5; // velocity

        // Scale things according to depth
        this.velocity = v/d;
    }

    updatePosition ()
    {
        this.y += this.velocity;
    }
}

export { Snowflake };