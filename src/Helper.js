export function checkCollisionsWith(items1, items2) {
    for (let item1 of items1) {
        for (let item2 of items2) {
            if (checkCollision(item1, item2)) {
                item1.die();
                item2.die();
            }
        }
    }
}

function checkCollision(obj1, obj2) {
    const vx = obj1.position.x - obj2.position.x;
    const vy = obj1.position.y - obj2.position.y;
    const length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
        return true;
    }

    return false;
}