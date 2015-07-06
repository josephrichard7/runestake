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
			var _this = this;
			setTimeout(function(){
				var background 	= _this.game.add.sprite(0, 0, 'background');
				background.scale.setTo(0.5, 0.5);

				_this.game.scale.pageAlignHorizontally 	= true;
				_this.game.scale.pageAlignVertically 	= true;
				_this.game.scale.refresh();

				_this.game.leftGambler.fnCreate();
				_this.game.rightGambler.fnCreate();
				_this.game.leftGambler.fnStartStandby();
				_this.game.rightGambler.fnStartStandby();
				_this.game.leftGambler.fnStartCountDown();
				_this.game.rightGambler.fnStartCountDown();
				
				setTimeout(function(){
					_this.game.stakemainSrv.fnGamblerReady();
				}, 7000);
			}, 0);
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

		StakeGame.prototype.fnDestroy = function(){
			this.game.destroy();
			this.game = null;
		};

		return StakeGame;
	}
]);