import { Drawable } from "./drawable";

class Snowflake extends Drawable {
    constructor(x, y, image) {
        super(x, y);
        this.image = image;
    }
}

export { Snowflake };