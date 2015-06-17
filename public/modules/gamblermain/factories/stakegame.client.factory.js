'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.factory(ApplicationConfiguration.factories.stakegame, [
	'$window',
	ApplicationConfiguration.factories.stakegambler,
	function($window, GamblerFactory) {
		
		/*jshint latedef: false*/
		function StakeGame(stakemainSrv){
			this.game = new Phaser.Game(600, 400, Phaser.CANVAS, 'game', {
				preload: this.preload,
				create:  this.create
			});
			this.game.stakemainSrv 	= stakemainSrv;
		}

		StakeGame.prototype.preload = function() {
			var iam;

		    this.game.load.baseURL 		= $window.location.protocol + '//' + $window.location.host;//'http://i.imgur.com/';
		    this.game.load.crossOrigin 	= 'anonymous';

 			this.game.load.image('background', '/modules/gamblermain/img/runestake_bg.png');

 			iam = this.game.stakemainSrv.authentication.user._id === this.game.stakemainSrv.stake.leftGambler;
		    this.game.leftGambler 	= new GamblerFactory(this.game, 'LEFT', iam);

		    iam = this.game.stakemainSrv.authentication.user._id === this.game.stakemainSrv.stake.rightGambler;
		    this.game.rightGambler 	= new GamblerFactory(this.game, 'RIGHT', iam);
		};

		StakeGame.prototype.create = function() {
			var background 	= this.game.add.sprite(0, 0, 'background');
			var _this 		= this;
			background.scale.setTo(0.5, 0.5);

			this.game.leftGambler.fnCreate();
			this.game.rightGambler.fnCreate();
			this.game.leftGambler.fnStartStandby();
			this.game.rightGambler.fnStartStandby();
			this.game.leftGambler.fnStartCountDown();
			this.game.rightGambler.fnStartCountDown();
			
			setTimeout(function(){
				_this.game.stakemainSrv.fnGamblerReady();
			}, 7000);
		};

		StakeGame.prototype.fnHit = function(stakeHit){
			var gamblerHitFirst;
			var gamblerHitSecond;
			var firstGamblerHealth;
			var secondGamblerHealth;
			var firstGamblerHitReceived;
			var secondGamblerHitReceived;

			if(stakeHit.leftGamblerHitFirst){
				gamblerHitFirst 			= this.game.leftGambler;
				gamblerHitSecond			= this.game.rightGambler;
				firstGamblerHealth 			= stakeHit.leftGamblerHealth;
				secondGamblerHealth 		= stakeHit.rightGamblerHealth;
				firstGamblerHitReceived 	= stakeHit.amountHitReceivedLeftGambler;
				secondGamblerHitReceived 	= stakeHit.amountHitReceivedRightGambler;
			}else{
				gamblerHitFirst 			= this.game.rightGambler;
				gamblerHitSecond			= this.game.leftGambler;
				firstGamblerHealth 			= stakeHit.rightGamblerHealth;
				secondGamblerHealth 		= stakeHit.leftGamblerHealth;
				firstGamblerHitReceived 	= stakeHit.amountHitReceivedRightGambler;
				secondGamblerHitReceived 	= stakeHit.amountHitReceivedLeftGambler;
			}

			gamblerHitFirst.fnAttack();

			gamblerHitSecond.fnUpdateHitText(secondGamblerHitReceived);
			gamblerHitSecond.fnUpdateHealthBar(secondGamblerHealth);

			if(gamblerHitSecond.health === 0){
				gamblerHitSecond.fnDying();				
			}else{
				gamblerHitSecond.fnAttack();
				
				setTimeout(function(){
					gamblerHitFirst.fnUpdateHitText(firstGamblerHitReceived);
					gamblerHitFirst.fnUpdateHealthBar(firstGamblerHealth);

					if(gamblerHitFirst.health === 0){
						gamblerHitFirst.fnDying();	
					}
				}, 500);
			}
		};

		return StakeGame;
	}
]);