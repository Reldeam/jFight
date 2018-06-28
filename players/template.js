/**
 * jFight.addFleet(pilot) adds a fleet into the battle. The fleet size, ship starting
 * position, and ship capability are random (All ships will have the same
 * capabilities).
 *
 * You provide the pilot. All ship in your feet will have the same pilot.
 * The pilot is able to accelerate, turn, and fire the ship's weapon. The pilot is
 * given a ship to control. The ship can be seen as a snapshot of the ship's current
 * status (position, speed, health, ammo, etc). The pilot must use this information
 * to make an informed choice about the next 'move' to make.
 *
 * You should only call accelerate(), turn(), and fire() at most once. All subsequent
 * calls to these methods will fail.
 *
 * Remember that there is friendly fire and your ship cannot see the whole
 * battlefield (your ship can only sense ships that are within its sensor range).
 */
jFight.addFleet(function(ship)
{
    /**
     * Accelerates the ship for 1 tick by a given fraction of the ship's maximum
     * acceleration rate. The maximum acceleration rate of your ship is unknown as
     * it is different each game.
     *
     * The amount is given as: -1 <= amount <= 1
     * Where -1 is reversing at maximum acceleration and 1 is accelerating forward at
     * maximum acceleration.
     *
     * This method will only succeed the first time it is called. It will fail (do
     * nothing) on all subsequent attempts so, THERE IS NO POINT CALLING THIS METHOD
     * MORE THAN ONCE.
     *
     * Returns TRUE on successfully accelerating the ship.
     * Returns FALSE otherwise (all subsequent calls).
     */
    // ship.accelerate(amount)

    /**
     * The amount of ammo your ship has left.
     * Firing costs 1 ammo.
     */
    // ship.ammo()

    /**
     * The current direction your ship is moving in radians.
     */
    // ship.direction()

    /**
     * The current direction your ship is facing in radians.
     */
    // ship.facing()

    /**
     * Attempts to fire your ships weapon.
     *
     * The fire rate of your ship is unknown as it changes each game. Your ship will
     * only fire if it has not in the last (1000ms / FIRE_RATE_IN_MILLISECONDS).
     *
     * Note: Since you only get a snapshot of your ships current status, if firing
     * the weapon fails then it will always fail for the current snapshot. Therefore,
     * THERE IS NO POINT CALLING THIS METHOD MORE THAN ONCE.
     *
     * Returns TRUE if the weapon was fired successfully.
     * Returns FALSE otherwise.
     */
    // ship.fire()

    /**
     * The amount of health your ship has left.
     * It is unknown how much damage a single hit from an enemy will cause as this
     * value changes every game.
     */
    // ship.health()

    /**
     * An array of enemy ships' Position that are within your ship's sensor radius.
     * The radius of detection for your ship is unknown as it is different each game.
     *
     * For example:
     *
     * var enemies = ship.nearbyEnemies();
     * var enemy = enemies[0];
     * var xDis = enemy1.x() - ship.x();
     * var yDis = enemy1.y() - ship.y();
     * var dis = Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2));
     */
    // ship.nearbyEnemies()

    /**
     * An array of your ships' Position that are within your ship's sensor radius.
     * The radius of detection for your ship is unknown as it is different each game.
     *
     * See ship.nearbyEnemies() for an example.
     */
    // ship.nearbyFriends()

    /**
     * The current Position object of your ship.
     * x and y coordinates can be retrieved with position().x and position().y
     * respectively.
     *
     * For example:
     *
     * var currentPos = ship.position();
     * var currentX = currentPos.x();
     * var currentY = currentPos.y();
     */
    // ship.position()

    /**
     * The current speed your ship is moving at.
     */
    // ship.speed()

    /**
     * Turns the ship by a given fraction of the ship's maximum turn rate. The maximum
     * turn rate of your ship is unknown as it is different each game.
     *
     * The amount is given as: -1 <= amount <= 1
     * Where -1 is a hard left and 1 is a hard right from the ship's current facing.
     *
     * This method will only succeed the first time it is called. It will fail (do
     * nothing) on all subsequent attempts so, THERE IS NO POINT CALLING THIS METHOD
     * MORE THAN ONCE.
     *
     * Returns TRUE on successfully turning the ship.
     * Returns FALSE otherwise (all subsequent calls).
     */
    // ship.turn(amount)

    /**
     * The current x coordinate of your ship.
     * This method is faster than calling position().
     */
    // ship.x()

    /**
     * The current y coordinate of your ship.
     * This method is faster than calling position().
     */
    // ship.y()

    /**
     * The current height of the world.
     * The y domain of the world is [0, jFight.height()].
     */
    // jFight.height()

    /**
     * The current width of the world.
     * The x domain of the world is [0, jFight.width()].
     */
    // jFight.width()

}, "#FFFFFF"); // Set your own team colour.


