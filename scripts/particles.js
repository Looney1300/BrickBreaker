MyGame.particleSystem = (function(){
    /*
    BurningParticles creates a particle effect based on spec passed to it, which has...
      x
      y
      particlesPerMS
      lifetime.mean
      lifetime.std
      size.mean
      size.std
      stroke/fill/imageSrc
      maxRotation

    */
    function BurningEffect(spec){
        let that = {};
        that.particles = [];
        
        that.update = function(elapsedTime){
            let keepMe = [];
            for (let particle = 0; particle < that.particles.length; particle++) {
                that.particles[particle].alive += elapsedTime;
                that.particles[particle].position.x += (elapsedTime * that.particles[particle].speed * that.particles[particle].direction.x);
                that.particles[particle].position.y += (elapsedTime * that.particles[particle].speed * that.particles[particle].direction.y);
                if (spec.hasOwnProperty('maxRotation')){
                    that.particles[particle].rotation += Random.nextGaussian( 0, spec.maxRotation);
                }
            
                if (that.particles[particle].alive <= that.particles[particle].lifetime) {
                    keepMe.push(that.particles[particle]);
                }
            }
            
            //Makes a certain number of particles per millisecond.
            //There is a lower limit to particlesPerMS, because if there is any elapsedTime at all, 
            // it will always make at least one particle per frame, becuase it rounds up.
            for (let particle = spec.particlesPerMS; particle < (spec.particlesPerMS*elapsedTime); particle++) {
                let p = {
                    position: { x: spec.x, y: spec.y },
                    direction: Random.nextCircleVector(),
                    speed: Random.nextGaussian( 0.05, .025 ),	// pixels per millisecond
                    rotation: 0,
                    lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std),	// milliseconds
                    alive: 0,
                    size: Random.nextGaussian(spec.size.mean, spec.size.std),
                };
                if (spec.hasOwnProperty('fill')){
                    p.fill = spec.fill;
                }
                if (spec.hasOwnProperty('stroke')){
                    p.stroke = spec.stroke;
                }
                if (spec.hasOwnProperty('imageSrc')){
                    p.imageSrc = spec.imageSrc;
                }
                keepMe.push(p);
            }

            that.particles = keepMe;
        }

        return that;
    }

    /*
    ExplosionEffect that expects an obect with...
      x
      y
      particlesPerMS
      lifetime.mean
      lifetime.std
      speed.mean
      speed.std
      size.mean
      size.std
      stroke/fill/imageSrc
      maxRotation
      duration
      gravity
    Returns false if particle effect has finished, true otherwise.
    To make a firework explosion just set speed standard deviation very close to 0.
    */
    function ExplosionEffect(spec){
        let that = {};
        that.particles = [];
        let timeUsed = 0;
        
        that.update = function(elapsedTime){
            let keepMe = [];
            
            for (let particle = 0; particle < that.particles.length; particle++) {
                that.particles[particle].alive += elapsedTime;
                if (spec.hasOwnProperty('gravity')){
                    that.particles[particle].direction.y += (elapsedTime * spec.gravity/1000);
                }
                that.particles[particle].position.x += (elapsedTime * that.particles[particle].speed * that.particles[particle].direction.x);
                that.particles[particle].position.y += (elapsedTime * that.particles[particle].speed * that.particles[particle].direction.y);
                if (spec.hasOwnProperty('maxRotation')){
                    that.particles[particle].rotation += Random.nextGaussian( 0, spec.maxRotation);
                }
                
                if (that.particles[particle].alive <= that.particles[particle].lifetime) {
                    keepMe.push(that.particles[particle]);
                }
            }
            
            timeUsed += elapsedTime;
            if (timeUsed < spec.duration){
                //Makes a certain number of particles per millisecond.
                //There is a lower limit to particlesPerMS, because if there is any elapsedTime at all, 
                // it will always make at least one particle per frame, becuase it rounds up.
                for (let particle = spec.particlesPerMS; particle < (spec.particlesPerMS*elapsedTime); particle++) {
                    let p = {
                        position: { x: spec.x, y: spec.y },
                        direction: Random.nextCircleVector(),
                        speed: Random.nextGaussian(spec.speed.mean, spec.speed.std),	// pixels per millisecond
                        rotation: 0,
                        lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std),	// milliseconds
                        alive: 0,
                        size: Random.nextGaussian(spec.size.mean, spec.size.std),
                    };
                    if (spec.hasOwnProperty('fill')){
                        p.fill = spec.fill;
                    }
                    if (spec.hasOwnProperty('stroke')){
                        p.stroke = spec.stroke;
                    }
                    if (spec.hasOwnProperty('imageSrc')){
                        p.imageSrc = spec.imageSrc;
                    }
                    keepMe.push(p);
                }
            }
            that.particles = keepMe;
            if (keepMe.length === 0){
                return false;
            }
            return true;

        }

        return that;
    }

    /*
    AreaDisolveEffect takes a certain area and makes it dissolve with a certain gravity. Expects object with...
      gravity
      x
      y
      xMax
      yMax
      numOfParticles
      lifetime.mean
      lifetime.std
      speed.mean
      speed.std
      stroke/fill/imageSrc
      maxRotation
    */
    function AreaDissolveEffect(spec){
        let that = {};
        that.particles = [];
    
        //Makes a certain number of particles per millisecond.
        //There is a lower limit to particlesPerMS, because if there is any elapsedTime at all, 
        // it will always make at least one particle per frame, becuase it rounds up.
        for (let particle = 0; particle < spec.numParticles; particle++) {
            let p = {
                position: { x: Random.nextRange(spec.x, spec.xMax), y: Random.nextRange(spec.y, spec.yMax) },
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(spec.speed.mean, spec.speed.std),	// pixels per millisecond
                rotation: 0,
                rotationRate: Random.nextGaussian( 0, spec.maxRotation),
                lifetime: Math.abs(Random.nextGaussian(spec.lifetime.mean, spec.lifetime.std)),	// milliseconds
                alive: 0,
                size: Random.nextGaussian(spec.size.mean, spec.size.std),
            };
            if (spec.hasOwnProperty('fill')){
                p.fill = spec.fill;
            }
            if (spec.hasOwnProperty('stroke')){
                p.stroke = spec.stroke;
            }
            if (spec.hasOwnProperty('imageSrc')){
                p.imageSrc = spec.imageSrc;
            }
            that.particles.push(p);
        }
        
        that.update = function(elapsedTime){
            let keepMe = [];
            
            for (let particle = 0; particle < that.particles.length; particle++) {
                that.particles[particle].alive += elapsedTime;
                if (spec.hasOwnProperty('gravity')){
                    that.particles[particle].direction.y += (elapsedTime * spec.gravity/1000);
                }
                that.particles[particle].position.x += (elapsedTime * that.particles[particle].speed * that.particles[particle].direction.x);
                that.particles[particle].position.y += (elapsedTime * that.particles[particle].speed * that.particles[particle].direction.y);
                if (spec.hasOwnProperty('maxRotation')){
                    that.particles[particle].rotation += that.particles[particle].rotationRate;
                }
                //If still alive, add to keepMe list.
                if (that.particles[particle].alive <= that.particles[particle].lifetime) {
                    keepMe.push(that.particles[particle]);
                }
            }

            that.particles = keepMe;
            if (keepMe.length === 0){
                return false;
            }
            return true;

        }

        return that;
    }

    return {
        BurningEffect: BurningEffect,
        ExplosionEffect: ExplosionEffect,
        AreaDissolveEffect: AreaDissolveEffect
    };

}());