const jFight = function()
{
    const FPS = 20;
    const FLEET_SIZE = 5;
    const MAX_TURN_RATE = 0.2;
    const MAX_ACCELERATION = 0.1;
    const MAX_HEALTH = 3;
    const MAX_AMMO = 100;
    const MAX_FIRE_RATE = 2;
    const BULLET_DAMAGE = 10;
    const BULLET_SPEED = 10;
    const START_AMMO = 3;
    const START_HEALTH = 5;
    const VIEW_DISTANCE = 100;
    const SPACESHIP_SIZE = 20;
    const BULLET_WIDTH = 2;
    const BULLET_LENGTH = 8;

    const world = {
        entity : null,
        width : function()
        {
            if(!this.entity) return 0;
            return this.entity.offsetWidth;
        },
        height : function()
        {
            if(!this.entity) return 0;
            return this.entity.offsetHeight;
        }
    };

    var currentTime = 0;
    var fleets = [];
    var bullets = [];
    var started = false;

    function destroySpaceship(spaceship)
    {
        spaceship.getEntity().parentNode.removeChild(spaceship.getEntity());

        var fleet = fleets[spaceship.public.team()];
        for(var i = 0; i < fleet.spaceships.length; i++) {
            if(spaceship == fleet.spaceships[i]) {
                fleet.spaceships.splice(i, 1);
                break;
            }
        }

        var wrapper = document.createElement("div");
        wrapper.className = "particle-wrapper";

        world.entity.appendChild(wrapper);

        var particle, angle, speed, xSpeed, ySpeed;

        angle = 0;
        xSpeed = 20 * spaceship.public.speed() * Math.cos(spaceship.public.direction());
        ySpeed = 20 * spaceship.public.speed() * Math.sin(spaceship.public.direction());
        wrapper.style.setProperty("--fly-rotation", angle + "deg");
        wrapper.style.setProperty("--fly-x", xSpeed + "px");
        wrapper.style.setProperty("--fly-y", ySpeed + "px");

        for(i = 0; i < 10; i++) {
            particle = document.createElement("div");
            particle.className = "particle";
            particle.style.backgroundColor = spaceship.getColour();
            particle.style.top = spaceship.public.y() + "px";
            particle.style.left = spaceship.public.x() + "px";
            angle = Math.random() * 360;
            speed = 100 * Math.random() + 100;
            xSpeed = speed * Math.cos(angle);
            ySpeed = speed * Math.sin(angle);
            particle.style.setProperty("--fly-rotation", angle + "deg");
            particle.style.setProperty("--fly-x", xSpeed + "px");
            particle.style.setProperty("--fly-y", ySpeed + "px");
            wrapper.appendChild(particle);
        }

        setTimeout(function() { wrapper.parentNode.removeChild(wrapper);}, 1000);
    }

    function destroyBullet(bullet)
    {
        bullet.entity.parentNode.removeChild(bullet.entity);
        for(var i = 0; i < bullets.length; i++) {
            if(bullet == bullets[i]) {
                bullets.splice(i, 1);
                break;
            }
        }
    }

    function loop()
    {
        var i, fleet, bullet;

        for(i in fleets) {
            fleet = fleets[i];
            fleet.update();
        }
        for(i in bullets) {
            bullet = bullets[i];
            bullet.update();
        }
        currentTime++;
    }

    function Fleet(team, pilot, colour)
    {
        this.team = team;
        this.spaceships = [];

        this.bootstrap = function()
        {
            var i, spaceship;
            for(i in this.spaceships) {
                spaceship = this.spaceships[i];
                spaceship.bootstrap();
            }
        };

        this.addSpaceship = function()
        {
            this.spaceships.push(new Spaceship(team, colour));
        };

        this.update = function()
        {
            var i, spaceship;
            for(i in this.spaceships) {

                spaceship = this.spaceships[i];
                pilot(spaceship.public);
                spaceship.update();
            }
        }
    }

    function Spaceship(team, colour)
    {
        var entity;

        var position = new Position(0, 0);
        var speed = 0;
        var acceleration = 0;
        var direction = 0;
        var facing = 0;

        var ammo = START_AMMO;
        var health = START_HEALTH;

        var lastTurned = 0;
        var lastAccelerated = 0;
        var lastFired = 0;

        var spaceship = this;

        this.getEntity = function()
        {
            return entity;
        };

        this.getColour = function() { return colour; }

        this.public = {
            team : function() { return team; },
            position : function () { return new Position(position.x(), position.y()) },
            x : function() { return position.x(); },
            y : function() { return position.y(); },
            speed : function() { return speed; },
            direction : function() { return direction; },
            facing : function() { return facing; },
            ammo : function() { return ammo; },
            health : function() { return health; },

            turn : function(amount)
            {
                if(lastTurned == currentTime) return false;
                lastTurned = currentTime;

                if(amount > 1) amount = 1;
                if(amount < -1) amount = -1;

                amount *= MAX_TURN_RATE;
                facing += amount;
                return true;
            },

            accelerate : function(amount)
            {
                if(lastAccelerated == currentTime) return false;
                lastAccelerated = currentTime;

                if(amount > 1) amount = 1;
                if(amount < -1) amount = -1;

                amount *= MAX_ACCELERATION;

                acceleration = amount;
                return true;
            },

            fire : function()
            {
                if((currentTime - lastFired) < 1000 / (FPS * MAX_FIRE_RATE)) return false;
                if(ammo <= 0) return false;
                lastFired = currentTime;
                ammo--;

                var xStart = position.x() + SPACESHIP_SIZE * Math.cos(facing);
                var yStart = position.y() + SPACESHIP_SIZE * Math.sin(facing);

                var bullet = new Bullet(spaceship, new Position(xStart, yStart), facing, speed + BULLET_SPEED);
                bullets.push(bullet);

                return true;
            },

            nearbyEnemies : function()
            {
                var fleet;
                var enemies = [];

                for(var i = 0; i < fleets.length; i++) {
                    if(i == team) continue;
                    fleet = fleets[i];
                    for(var enemy in fleet) {
                        if(spaceship.distanceTo(enemy) <= VIEW_DISTANCE) {
                            enemies.push(enemy.public.position());
                        }
                    }
                }

                return enemies;
            },

            nearbyFriends : function()
            {
                var friends = [];

                for(var friend in fleets[team]) {
                    if(spaceship.distanceTo(friend) <= VIEW_DISTANCE) {
                        friends.push(friend.public.position());
                    }
                }

                return friends;
            }
        };

        this.bootstrap = function() {

            var collision = true;
            while (collision) {
                collision = false;
                position.setX(Math.random() * world.width());
                position.setY(Math.random() * world.height());
                console.log(position);
                for (var u in fleets) {
                    var fleet = fleets[u];
                    for (var v in fleet.spaceships) {
                        var target = fleet.spaceships[v];
                        if (target == this) continue;
                        if (this.distanceTo(target) < 2 * SPACESHIP_SIZE) {
                            collision = true;
                            break;
                        }
                    }
                    if (collision) break;
                }
            }

            var xMiddle = world.width() / 2;
            var yMiddle = world.height() / 2;

            var xDis = xMiddle - position.x();
            var yDis = yMiddle - position.y();

            direction = Math.atan2(yDis, xDis);
            facing = direction;

            entity = document.createElement("div");
            entity.className = "spaceship";
            entity.style.width = SPACESHIP_SIZE + "px";
            entity.style.height = SPACESHIP_SIZE + "px";
            entity.style.backgroundColor = colour;

            world.entity.appendChild(entity);

            this.update();
        };

        this.update = function()
        {
            var xSpeed = speed * Math.cos(direction);
            var ySpeed = speed * Math.sin(direction);

            var xChange = acceleration * Math.cos(facing);
            var yChange = acceleration * Math.sin(facing);

            var xDis = xSpeed + xChange;
            var yDis = ySpeed + yChange;

            var timeToCollision = 1;
            var target = null;
            var fleet, ship, t;

            for(var u in fleets) {
                fleet = fleets[u];
                for(var v in fleet.spaceships) {
                    ship = fleet.spaceships[v];
                    if(ship == spaceship) continue;
                    t = spaceship.timeToCollision(ship);
                    if(!t) continue;
                    if(t > 0 && t < timeToCollision) {
                        timeToCollision = t;
                        target = ship;
                    }
                }
            }

            if(target) {
                destroySpaceship(spaceship);
                destroySpaceship(target);
            }
            else {
                position.setX(position.x() + xDis);
                position.setY(position.y() + yDis);

                if(position.x() < 0 || position.x() > world.width()
                || position.y() < 0 || position.y() > world.height()) {
                    // For explosion to look like it hit the wall.
                    direction += Math.PI;

                    destroySpaceship(spaceship);
                }
                else {
                    speed = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
                    direction = Math.atan2(yDis, xDis);

                    entity.style.left = position.x() - SPACESHIP_SIZE / 2 + "px";
                    entity.style.top = position.y() - SPACESHIP_SIZE / 2 + "px";
                    entity.style.transform = "rotate(" + (facing * 180 / Math.PI + 90) + "deg)";
                    //spaceship.addTrail();
                }
            }
        };

        this.addTrail = function()
        {
            var trail = document.createElement("div");
            trail.className = "spaceship fade";
            trail.style.width = SPACESHIP_SIZE + "px";
            trail.style.height = SPACESHIP_SIZE + "px";
            trail.style.backgroundColor = colour;
            trail.style.left = position.x() - SPACESHIP_SIZE / 2 + "px";
            trail.style.top = position.y() - SPACESHIP_SIZE / 2 + "px";
            trail.style.transform = "rotate(" + (facing * 180 / Math.PI + 90) + "deg)";

            world.entity.appendChild(trail);
            setTimeout(function() {trail.parentNode.removeChild(trail);}, 1000);
        };

        this.timeToCollision = function(target)
        {
            var xSpeed = speed * Math.cos(direction);
            var ySpeed = speed * Math.sin(direction);

            var xChange = acceleration * Math.cos(facing);
            var yChange = acceleration * Math.sin(facing);

            var dx = xSpeed + xChange;
            var dy = ySpeed + yChange;

            var m1 = dx == 0 ? null : dy / dx;
            var b1 = m1 == null ? null : position.y() - m1 * position.x();

            var m2 = m1 == null ? 0 : -1 / m1;
            var b2 = m1 == null ? target.public.y() : target.public.y() - m2 * target.public.x();

            var x = m1 == null ? position.x() : (b2 - b1) / (m1 - m2);
            var y = m1 == null ? target.public.y() : (m2 * b1 - m1 * b2) / (m2 - m1);

            var xDis = x - target.public.x();
            var yDis = y - target.public.y();
            var dis = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));

            if(dis >= SPACESHIP_SIZE) return null;

            return (x - position.x()) / (speed * Math.cos(direction));
        };

        this.damage = function(amount)
        {
            health -= amount;
            if(health <= 0) destroySpaceship(this);
        };

        this.heal = function(amount)
        {
            health += amount;
            if(health >= MAX_HEALTH) health = MAX_HEALTH;
        };

        this.pickUpAmmo = function(amount)
        {
            ammo += amount;
            if(ammo >= MAX_AMMO) ammo = MAX_AMMO;
        };

        this.distanceTo = function(ship)
        {
            var xDis = position.x() - ship.public.x();
            var yDis = position.y() - ship.public.y();

            return Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
        }
    }

    function Bullet(owner, position, direction, speed)
    {
        this.owner = owner;
        this.position = position;
        this.direction = direction;
        this.speed = speed;

        this.entity = document.createElement("div");
        this.entity.className = "bullet";

        this.entity.style.transform = "rotate(" + (direction * 180 / Math.PI + 90) + "deg)";

        this.entity.style.width = BULLET_WIDTH + "px";
        this.entity.style.height = BULLET_LENGTH + "px";

        this.entity.style.left = this.position.x() - (BULLET_WIDTH / 2) + "px";
        this.entity.style.top = this.position.y() - (BULLET_LENGTH / 2) + "px";

        this.entity.style.backgroundColor = owner.getColour();

        world.entity.appendChild(this.entity);

        this.update = function()
        {
            var xDis = this.speed * Math.cos(this.direction);
            var yDis = this.speed * Math.sin(this.direction);

            var u, v, t, fleet, ship;

            var timeToCollision = 1;
            var target = null;

            for(u in fleets) {
                fleet = fleets[u];
                for(v in fleet.spaceships) {
                    ship = fleet.spaceships[v];
                    if(ship == this.owner) continue;
                    t = this.getCollisionTime(ship);
                    if(!t) continue;
                    if(t > 0 && t < timeToCollision) {
                        timeToCollision = t;
                        target = ship;
                    }
                }
            }

            if(target) {
                target.damage(BULLET_DAMAGE);
                destroyBullet(this);
            }
            else {
                this.position.setX(this.position.x() + xDis);
                this.position.setY(this.position.y() + yDis);

                if(this.position.x() < 0 || this.position.x() > world.width()
                || this.position.y() < 0 || this.position.y() > world.height()) {
                    destroyBullet(this);
                }
                else {
                    this.entity.style.left = this.position.x() - (BULLET_WIDTH / 2) + "px";
                    this.entity.style.top = this.position.y() - (BULLET_LENGTH / 2) + "px";
                }
            }
        };

        this.getCollisionTime = function(spaceship)
        {
            var dx = this.speed * Math.cos(this.direction);
            var dy = this.speed * Math.sin(this.direction);

            var m1 = dx == 0 ? null : dy / dx;
            var b1 = m1 == null ? null : this.position.y() - m1 * this.position.x();

            var m2 = m1 == null ? 0 : -1 / m1;
            var b2 = m1 == null ? spaceship.public.y() : spaceship.public.y() - m2 * spaceship.public.x();

            var x = m1 == null ? this.position.x() : (b2 - b1) / (m1 - m2);
            var y = m1 == null ? spaceship.public.y() : (m2 * b1 - m1 * b2) / (m2 - m1);

            var xDis = x - spaceship.public.x();
            var yDis = y - spaceship.public.y();
            var dis = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));

            if(dis >= SPACESHIP_SIZE / 2) return null;

            return (x - this.position.x()) / (this.speed * Math.cos(this.direction));
        }
    }

    function Position(x, y)
    {
        this.x = function() { return x; };
        this.y = function() { return y; };
        this.setX = function(newX) { x = newX; };
        this.setY = function(newY) { y = newY; };
    }

    return {
        addFleet : function(pilot, colour)
        {
            var fleet = new Fleet(fleets.length, pilot, colour);
            for(var i = 0; i < FLEET_SIZE; i++) fleet.addSpaceship();
            fleets.push(fleet);
        },

        width : function() { return world.width(); },
        height : function() { return world.height(); },

        begin : function()
        {
            if(started) return false;
            started = true;
            world.entity = document.getElementById("jFight");
            var i, fleet;
            for(i in fleets) {
                fleet = fleets[i];
                fleet.bootstrap();
            }
            setInterval(loop, 1000 / FPS);
            return true;
        }
    };
}();
