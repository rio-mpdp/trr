var trex, trex_runs, edges, groundimage, invisableground, cloudimage, o1, o2, o3, o4, o5, o6, cloudg, ogroup, treximage, aviraptor1, aviraptor2, rg, invisablebg, gameover, restart, gmi, ri, die, jump, checkpoint, temp;
var score = 0;

function preload() {
  trex_runs = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png","trex_2.png");
  groundimage = loadImage("bg.png");
  cloudimage = loadImage("cloud.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
   treximage = loadImage("trex_collided.png");
  aviraptor1 = loadAnimation("1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png");
  aviraptor2 = loadAnimation("1.png")
  gmi = loadImage("gameOver.png");
  ri = loadImage("restart.png");
  die = loadSound("collided.wav");
    jump = loadSound("jump.wav")
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  trex = createSprite(40, height - 70, 20, 20);
  trex.addAnimation("runs", trex_runs);
  trex.addAnimation("dies", treximage);
  trex.scale = 0.1
    trex.setCollider("rectangle", 0, 0, 400, 440)
  edges = createEdgeSprites();
   invisableground = createSprite(width / 2, height - 30, width, 10);
  invisableground.visible = false;
   temp = 0
  gamestate = 0;
  rg = new Group();
  invisablebg = createSprite(width / 2, height / 2, width, height)
  invisablebg.visible = false;
  gameover = createSprite(width / 2, height / 2);
  gameover.addImage(gmi)
  restart = createSprite(width / 2, gameover.y - 100);
  restart.addImage(ri)
  restart.scale = 0.2
  restart.visible = false;
  gameover.visible = false;
 cloudg = new Group();
  ogroup = new Group();

}

function createclouds() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(width, Math.round(random(10, height - 100)), 10, 10);
    cloud.velocityX = -2;
    cloud.addImage(cloudimage)
    cloud.depth = trex.depth;
    trex.depth += 1
    cloud.lifetime = width / 2 + 20
    cloudg.add(cloud)
  }
}

function createraptors() {
  if (frameCount % 150 == 0) {
    r = createSprite(width, Math.round(random(10, height - 200)), 10, 10);
    r.velocityX = -5;
    r.addAnimation("fly", aviraptor1)
    r.addAnimation("stop", aviraptor2)
    r.scale = 0.3
    r.lifetime = width / 2 + 20
    rg.add(r);
  }
}


function obstacle1() {
  if (frameCount % 100 == 0) {
    obstacle = createSprite(width, height - 50, 10, 10);
    obstacle.velocityX = -11;
    obstacle.lifetime = width / 2
    var d = Math.round(random(1, 4));
    switch (d) {
      case 1:
        obstacle.addImage(o1);
        obstacle.scale = 0.3 ;
        break;
      case 2:
        obstacle.addImage(o2);
        obstacle.scale = 0.3;
        break;
      case 3:
        obstacle.addImage(o3);
        obstacle.scale = 0.15;
        obstacle.y = height - 70
        break;
      case 4:
        obstacle.addImage(o4);
        obstacle.scale = 0.15;
        obstacle.y = height - 70
        break;

    }
    ogroup.add(obstacle)
  }

}

function callback(sprite1, sprite2) {
  sprite1.changeAnimation("stop")
}

function draw() {

  background("lightblue");
  if (gamestate == 0) {
    if (trex.collide(ogroup) || rg.overlap(trex, callback)) {
      die.play()
      gamestate = 1;

    }

    if ((keyDown("space") || touches.length > 0) && trex.y >= height-100
    ) {
      jump.play()
      trex.velocityY = -15;

    }
    createclouds();
    obstacle1();
    createraptors();
       if (frameCount % 60 == 0) {
      score += 1
      temp = score
    }
     } else if (gamestate == 1) {
    ogroup.setVelocityXEach(0);
    cloudg.setVelocityXEach(0);
    rg.setVelocityXEach(0);
    // ground.velocityX = 0;
    trex.setVelocity(0, 0);
    trex.changeAnimation("dies")
    rg.overlap(invisablebg, callback)
    ogroup.setLifetimeEach(-1)
    cloudg.setLifetimeEach(-1)
    rg.setLifetimeEach(-1)
    gameover.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart) || touches.length > 0) {
      ogroup.destroyEach()
      rg.destroyEach()
      cloudg.destroyEach()
      gameover.visible = false;
      restart.visible = false;
      trex.changeAnimation("runs")
      gamestate = 0
      score=0
    }
  }
  trex.velocityY = trex.velocityY + 0.8
  trex.collide(invisableground);
  fill("red")
  textSize(20)
  text("Score: " + score, width - 100, 20);

  drawSprites();

}