class Bullet {
	constructor(x, y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
		if (this.x == 20){
			this.g = true;
		}
		this.show = function () {
			fill(20, 0, 220);
			ellipse(this.x, this.y, 15, 15);
		};
		this.move = function () {
			this.x += 15*this.z;
			
		};
	}
}