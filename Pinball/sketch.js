(() => {
    // plugins
    Matter.use(MatterAttractors);
  
    // constants
    const PATHS = {
      DOME: '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20 303.9 25.7 338.3 36.9 370.5 53.3 399.8 74.6 425.4 100.2 446.7 129.5 463.1 161.7 474.3 196.1 480 231.9 480 250 500 250 500 0 0 0',
      DROP_LEFT: '0 0 20 0 70 100 20 150 0 150 0 0',
      DROP_RIGHT: '50 0 68 0 68 150 50 150 0 100 50 0',
      APRON_LEFT: '0 0 180 120 0 120 0 0',
      APRON_RIGHT: '180 0 180 120 0 120 180 0'
    };
    const COLOR = {
      BACKGROUND: '#212529',
      OUTER: '#495057',
      INNER: '#15aabf',
      PEGS: '#8044bf',
      BUMPER: '#fab005',
      BUMPER_LIT: '#fff3bf',
      PADDLE: '#e64980',
      PINBALL: '#dee2e6'
    };
    const GRAVITY = 0.75;
    const WIREFRAMES = false;
    const BUMPER_BOUNCE = 1.5;
    const WALL_BOUNCE = 1.2;
    const PADDLE_PULL = 0.002;
    const MAX_VELOCITY = 40;
  
    // score elements
    //let $currentScore = document.getElementById("cur_score");//$('.current-score span');//
    //let $highScore = document.getElementById("hi_score");//$('.high-score span');//
  
    // shared variables
    let currentScore, highScore;
    let engine, world, render, runner, pinball, shooter, stopperGroup;
    let leftPaddle, leftUpStopper, leftDownStopper, isLeftPaddleUp;
    let rightPaddle, rightUpStopper, rightDownStopper, isRightPaddleUp;
    let pinballs = [];
    let pinballNum=4;
    let shooterForce;
    let shooterHeight=100;
    let shooterCounter=1;

    // Get the modal
    //var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    //var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    // span.onclick = function() {
    //   modal.style.display = "none";
    //   window.location.reload();
    // }

    // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) {
    //   if (event.target == modal) {
    //     modal.style.display = "none";
    //     window.location.reload();
    //   }
    // }
  
    function load() {
      init();
      createStaticBodies();
      createPaddles();
      createPinball();
      createShooter();
      createEvents();
      //updateScore(currentScore);
    }
  
    function init() {
      // engine (shared)
      engine = Matter.Engine.create();
  
      // world (shared)
      world = engine.world;
      world.bounds = {
        min: { x: 0, y: 0},
        max: { x: 500, y: 800 }
      };
      world.gravity.y = GRAVITY; // simulate rolling on a slanted table
  
      // render (shared)
      render = Matter.Render.create({
        element: $('.container')[0],
        engine: engine,
        options: {
          width: world.bounds.max.x,
          height: world.bounds.max.y,
          wireframes: WIREFRAMES,
          background: COLOR.BACKGROUND
        }
      });
      Matter.Render.run(render);
  
      // runner
      runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
  
      // used for collision filtering on various bodies
      stopperGroup = Matter.Body.nextGroup(true);
  
      // starting values
      currentScore = 0;
      highScore = 0;
      isLeftPaddleUp = false;
      isRightPaddleUp = false;
      
      download();//get high score from server
    }

    function createStaticBodies() {
      Matter.World.add(world, [
        // table boundaries (top, bottom, left, right)
        boundary(250, -30, 500, 100),
        boundary(250, 830, 500, 100),
        boundary(-30, 400, 100, 800),
        boundary(530, 400, 100, 800),
  
        // dome
        path(239, 86, PATHS.DOME),
  
        // pegs (left, mid, right)
        wall(140, 140, 20, 40, COLOR.PEGS, 0, 'wall'),
        wall(225, 140, 20, 40, COLOR.PEGS, 0, 'wall2'),
        wall(310, 140, 20, 40, COLOR.PEGS, 0, 'wall2'),
  
        // top bumpers (left, mid, right)
        bumper(105, 250),
        bumper(225, 250),
        bumper(345, 250),
  
        // bottom bumpers (left, right)
        bumper(165, 340),
        bumper(285, 340),
  
        // shooter lane wall
        wall(440, 520, 20, 560, COLOR.OUTER),
  
        // drops (left, right)
        path(25, 360, PATHS.DROP_LEFT),
        path(425, 360, PATHS.DROP_RIGHT),
  
        // slingshots (left, right)
        wall(120, 510, 20, 120, COLOR.INNER, 0, 'wall1'),
        wall(330, 510, 20, 120, COLOR.INNER, 0, 'wall1'),
  
        // out lane walls (left, right)
        wall(60, 529, 20, 160, COLOR.INNER),
        wall(390, 529, 20, 160, COLOR.INNER),
  
        // flipper walls (left, right);
        wall(93, 624, 20, 98, COLOR.INNER, -0.96),
        wall(357, 624, 20, 98, COLOR.INNER, 0.96),
  
        // aprons (left, right)
        path(79, 740, PATHS.APRON_LEFT),
        path(371, 740, PATHS.APRON_RIGHT),
  
        // reset zones (center, right)
        reset(225, 50),
        //reset(465, 30)
      ]);
    }
  
    function createPaddles() {
      // these bodies keep paddle swings contained, but allow the ball to pass through
      leftUpStopper = stopper(160, 591, 'left', 'up');
      leftDownStopper = stopper(140, 743, 'left', 'down');
      rightUpStopper = stopper(290, 591, 'right', 'up');
      rightDownStopper = stopper(310, 743, 'right', 'down');
      Matter.World.add(world, [leftUpStopper, leftDownStopper, rightUpStopper, rightDownStopper]);
  
      // this group lets paddle pieces overlap each other
      let paddleGroup = Matter.Body.nextGroup(true);
  
      // Left paddle mechanism
      let paddleLeft = {};
      paddleLeft.paddle = Matter.Bodies.trapezoid(170, 660, 20, 80, 0.33, {
        label: 'paddleLeft',
        angle: 1.57,
        chamfer: {},
        render: {
          fillStyle: COLOR.PADDLE
        }
      });
      paddleLeft.brick = Matter.Bodies.rectangle(172, 672, 40, 80, {
        angle: 1.62,
        chamfer: {},
        render: {
          visible: false
        }
      });
      paddleLeft.comp = Matter.Body.create({
        label: 'paddleLeftComp',
        parts: [paddleLeft.paddle, paddleLeft.brick]
      });
      paddleLeft.hinge = Matter.Bodies.circle(142, 660, 5, {
        isStatic: true,
        render: {
          visible: false
        }
      });
      Object.values(paddleLeft).forEach((piece) => {
        piece.collisionFilter.group = paddleGroup
      });
      paddleLeft.con = Matter.Constraint.create({
        bodyA: paddleLeft.comp,
        pointA: { x: -29.5, y: -8.5 },
        bodyB: paddleLeft.hinge,
        length: 0,
        stiffness: 0
      });
      Matter.World.add(world, [paddleLeft.comp, paddleLeft.hinge, paddleLeft.con]);
      Matter.Body.rotate(paddleLeft.comp, 0.57, { x: 142, y: 660 });
  
      // right paddle mechanism
      let paddleRight = {};
      paddleRight.paddle = Matter.Bodies.trapezoid(280, 660, 20, 80, 0.33, {
        label: 'paddleRight',
        angle: -1.57,
        chamfer: {},
        render: {
          fillStyle: COLOR.PADDLE
        }
      });
      paddleRight.brick = Matter.Bodies.rectangle(278, 672, 40, 80, {
        angle: -1.62,
        chamfer: {},
        render: {
          visible: false
        }
      });
      paddleRight.comp = Matter.Body.create({
        label: 'paddleRightComp',
        parts: [paddleRight.paddle, paddleRight.brick]
      });
      paddleRight.hinge = Matter.Bodies.circle(308, 660, 5, {
        isStatic: true,
        render: {
          visible: false
        }
      });
      Object.values(paddleRight).forEach((piece) => {
        piece.collisionFilter.group = paddleGroup
      });
      paddleRight.con = Matter.Constraint.create({
        bodyA: paddleRight.comp,
        pointA: { x: 29.5, y: -8.5 },
        bodyB: paddleRight.hinge,
        length: 0,
        stiffness: 0
      });
      Matter.World.add(world, [paddleRight.comp, paddleRight.hinge, paddleRight.con]);
      Matter.Body.rotate(paddleRight.comp, -0.57, { x: 308, y: 660 });
    }

    function createShooter(){
      shooter = Matter.Bodies.rectangle(465, 735, 30, shooterHeight, {
        angle: 0,
        isStatic: true,
        render: {
          visible: true,
          fillStyle: COLOR.PADDLE,
          xScale: 1,
          yScale: 1
        }
      });
      Matter.World.add(world, shooter);
      Matter.Body.setCentre(shooter, {x:0, y:shooterHeight/2}, true);
      shooterForce=0;
      // shooter.position.y = shooter.position.y+shooter.height/2;
      // shooter.positionPrev.y = shooter.position.y+shooter.height/2;
    }
  
    function createPinball() {
      // x/y are set to when pinball is launched
      for(var i=0;i<pinballNum;i++){
        pinballs.push( Matter.Bodies.circle(280+28*i, 793, 14, {
          label: 'pinball',
          collisionFilter: {
            group: stopperGroup
          },
          render: {
            fillStyle: COLOR.PINBALL
          }
        }));
        Matter.World.add(world, pinballs[pinballs.length-1]);
      }
      currentPinball=pinballNum-1;
      launchPinball();
    }
  
    function createEvents() {
      // events for when the pinball hits stuff
      Matter.Events.on(engine, 'collisionStart', function(event) {
        let pairs = event.pairs;
        pairs.forEach(function(pair) {
          if (pair.bodyB.label === 'pinball') {
            switch (pair.bodyA.label) {
              case 'reset':
                Matter.World.remove(world,pinballs[currentPinball]);
                pinballs.splice(currentPinball,1);
                currentPinball--;
                if(currentPinball<0){
                  gameover();
                }else{
                  launchPinball();
                }
                break;
              case 'bumper':
                pingBumper(pair.bodyA);
                break;
            case 'wall1':
                pingWall(pair.bodyA);
                break;
            case 'wall2':
                pingWall2(pair.bodyA);
                break;
            }
          }
        });
      });
  
      // regulate pinball
      Matter.Events.on(engine, 'beforeUpdate', function(event) {
        // bumpers can quickly multiply velocity, so keep that in check
        Matter.Body.setVelocity(pinball, {
          x: Math.max(Math.min(pinball.velocity.x, MAX_VELOCITY), -MAX_VELOCITY),
          y: Math.max(Math.min(pinball.velocity.y, MAX_VELOCITY), -MAX_VELOCITY),
        });
  
        // cheap way to keep ball from going back down the shooter lane
        if (pinball.position.x > 450 && pinball.velocity.y > 0) {
          Matter.Body.setVelocity(pinball, { x: 0, y: 0 });//-10
        }
      });
  
      // mouse drag (god mode for grabbing pinball)
      Matter.World.add(world, Matter.MouseConstraint.create(engine, {
        mouse: Matter.Mouse.create(render.canvas),
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      }));
      
      // $('body').on('load', function(e) {
      //   updateScore(currentScore);
      // });
      // keyboard paddle events
      $('body').on('keydown', function(e) {
        if (e.which === 37) { // left arrow key
          isLeftPaddleUp = true;
        } else if (e.which === 39) { // right arrow key
          isRightPaddleUp = true;
        } else if(e.which === 27){ // escape
          runner.enabled=!runner.enabled;
        }else if(e.which === 40){ //down arrow key
          shooter.render.yScale = shooter.render.yScale - 0.01;
          shooterCounter*=shooter.render.yScale;
          Matter.Body.scale(shooter, shooter.render.xScale, shooter.render.yScale);
          shooterForce+=5;
          //console.log(shooter.render.yScale+" "+shooterForce);
        }
      });
      $('body').on('keyup', function(e) {
        if (e.which === 37) { // left arrow key
          isLeftPaddleUp = false;
        } else if (e.which === 39) { // right arrow key
          isRightPaddleUp = false;
        } else if(e.which === 40){ //down arrow key
          Matter.Body.setVelocity(pinball, { x: 0, y: -shooterForce});// -25 + rand(-2, 2) });
          Matter.Body.setAngularVelocity(pinball, 0);
          shooterForce=0;
          Matter.Body.scale(shooter, shooter.render.xScale, 1/shooterCounter);
          shooterCounter=1;
        }
      });
  
      // click/tap paddle events
      $('.left-trigger')
        .on('mousedown touchstart', function(e) {
          isLeftPaddleUp = true;
        })
        .on('mouseup touchend', function(e) {
          isLeftPaddleUp = false;
        });
      $('.right-trigger')
      .on('mousedown touchstart', function(e) {
          isRightPaddleUp = true;
        })
        .on('mouseup touchend', function(e) {
          isRightPaddleUp = false;
        });
    }
  
    function launchPinball() {
      pinball = pinballs[currentPinball];
      updateScore(currentScore);
      Matter.Body.setPosition(pinball, { x: 465, y: 685 });
      Matter.Body.setVelocity(pinball, { x: 0, y: 0});// -25 + rand(-2, 2) });
      Matter.Body.setAngularVelocity(pinball, 0);
    }

    function gameover(){
      upload(""+highScore);
      currentScore = 0;
      isLeftPaddleUp = false;
      isRightPaddleUp = false;
      document.getElementById("myModal").style.display = "block";
      //window.location.reload();
    }

    function upload(text) {
      $.ajax({
        url: "http://www.cooknas.com/Pinball/SetHiScore.php?data="+text
      }).done(function(data) {
        console.log(data);
        //alert("High Score = " + data);
      });
    }

    function download() {
      $.ajax({
        url: "http://www.cooknas.com/Pinball/GetHiScore.php"
      }).done(function(data) {
        //alert("High Score = "+data);
        highScore=data;
        updateScore(currentScore);
      });
    }
  
    function pingBumper(bumper) {
      updateScore(currentScore + 20);
      // flash color
      bumper.render.fillStyle = COLOR.BUMPER_LIT;
      setTimeout(function() {
        bumper.render.fillStyle = COLOR.BUMPER;
      }, 100);
    }

    function pingWall(w) {
        updateScore(currentScore + 2);
        // flash color
        w.render.fillStyle = COLOR.BUMPER_LIT;
        w.render.lineWidth = 6;
        w.render.strokeStyle = '#ff0000';
        setTimeout(function() {
          w.render.fillStyle = COLOR.INNER;
          w.render.lineWidth = 0;
        }, 100);
      }
    
    function pingWall2(w) {
        updateScore(currentScore + 5);
        // flash color
        w.render.fillStyle = COLOR.BUMPER_LIT;
        w.render.lineWidth = 6;
        w.render.strokeStyle = '#ff0000';
        setTimeout(function() {
          w.render.fillStyle = COLOR.PEGS;
          w.render.lineWidth = 0;
        }, 100);
      }
  
    function updateScore(newCurrentScore) {
      console.log(newCurrentScore);
      currentScore = newCurrentScore;
      if(document.getElementById("cur_score")!=null)
        document.getElementById("cur_score").innerHTML = currentScore;
  
      highScore = Math.max(currentScore, highScore);
      if(document.getElementById("hi_score")!=null)
        document.getElementById("hi_score").innerHTML = highScore;
    }
  
    // matter.js has a built in random range function, but it is deterministic
    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    // outer edges of pinball table
    function boundary(x, y, width, height) {
      return Matter.Bodies.rectangle(x, y, width, height, {
        isStatic: true,
        render: {
          fillStyle: COLOR.OUTER
        }
      });
    }
  
    // wall segments
    function wall(x, y, width, height, color, angle = 0, lab = '') {
      var w = Matter.Bodies.rectangle(x, y, width, height, {
        label: lab,
        angle: angle,
        isStatic: true,
        chamfer: { radius: 10 },
        render: {
          fillStyle: color
        }
      });
      if(lab!='')w.restitution = WALL_BOUNCE;
      return w;
    }
  
    // bodies created from SVG paths
    function path(x, y, path) {
      let vertices = Matter.Vertices.fromPath(path);
      return Matter.Bodies.fromVertices(x, y, vertices, {
        isStatic: true,
        render: {
          fillStyle: COLOR.OUTER,
  
          // add stroke and line width to fill in slight gaps between fragments
          strokeStyle: COLOR.OUTER,
          lineWidth: 1
        }
      });
    }
  
    // round bodies that repel pinball
    function bumper(x, y) {
      let bumper = Matter.Bodies.circle(x, y, 25, {
        label: 'bumper',
        isStatic: true,
        render: {
          fillStyle: COLOR.BUMPER,
          lineWidth: 8,
          strokeStyle: '#909090'
        }
      });
  
      // for some reason, restitution is reset unless it's set after body creation
      bumper.restitution = BUMPER_BOUNCE;
  
      return bumper;
    }
  
    // invisible bodies to constrict paddles
    function stopper(x, y, side, position) {
      // determine which paddle composite to interact with
      let attracteeLabel = (side === 'left') ? 'paddleLeftComp' : 'paddleRightComp';
  
      return Matter.Bodies.circle(x, y, 40, {
        isStatic: true,
        render: {
          visible: false,
        },
        collisionFilter: {
          group: stopperGroup
        },
        plugin: {
          attractors: [
            // stopper is always a, other body is b
            function(a, b) {
              if (b.label === attracteeLabel) {
                let isPaddleUp = (side === 'left') ? isLeftPaddleUp : isRightPaddleUp;
                let isPullingUp = (position === 'up' && isPaddleUp);
                let isPullingDown = (position === 'down' && !isPaddleUp);
                if (isPullingUp || isPullingDown) {
                  return {
                    x: (a.position.x - b.position.x) * PADDLE_PULL,
                    y: (a.position.y - b.position.y) * PADDLE_PULL,
                  };
                }
              }
            }
          ]
        }
      });
    }
  
    // contact with these bodies causes pinball to be relaunched
    function reset(x, width) {
      return Matter.Bodies.rectangle(x, 781, width, 2, {
        label: 'reset',
        isStatic: true,
        render: {
          fillStyle: '#fff'
        }
      });
    }
  
    window.addEventListener('load', load, false);

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
      if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
        window.location.reload();
      }
    });

    // document.getElementsByClassName("spanclose")[0].addEventListener('click', function(event) {
    //   document.getElementById("myModal").style.display = "none";
    //   window.location.reload();
    // });

    updateScore(currentScore);
  })();