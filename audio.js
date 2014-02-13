// 资料文献 http://zctya.blog.163.com/blog/static/1209178201252594914611/
;(function(namespace, win){
	var expt = win,
		ns = namespace,
		audio = expt.document.createElement('audio');
		audio.setAttribute('autoplay','false');
		audio.volume = 0.5,
		source = expt.document.createElement('source');
		audio.appendChild(source);
	function isArray(obj){
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
	function regEvent(dom, type, fn){
		dom.addEventListener(type,fn);
	};
	var ERROR_STATUS = {
		1: '用户终止',
		2: '网络错误',
		3: '解码错误',
		4: 'URL无效'
	};
	// audio player
	var Player = {
		playIndex:0,
		isPlaying:false,
		init: function(playList){
			Player.playList = playList;
			Player._setPlayAudio();
		},
		initEvent: function(){
			var self = this;
			regEvent(audio, 'error', function( e ){
				var code = audio.error.code;
				self.ui.onError({
					code: code,
					msg: ERROR_STATUS[code]
				});
			});
			regEvent(audio, 'loadedmetadata', function(){
				self.ui.onDuration( self._duration.call(this) );
				regEvent(audio, 'progress', function(){ 
					var lp = self._loadProgress.call(this);
						self.ui.onLoadProgress( lp );
				});
			});
			regEvent(audio, 'timeupdate', function(){
				var pp = self._playProgress.call(this);
					self.ui.onPlayProgress( pp );
			});
			regEvent(audio,'pause',function(){
				self.ui.onPause();
			});
			regEvent(audio,'ended',function(){
				self.playIndex++;
				self._setPlayAudio();
				self._play();
			});
		},
		_setPlayAudio: function(){ // 设置要播放的音频
			var self = this;
			if( self.playIndex > Player.playList.length - 1 ){
				self.playIndex = 0;
			}
			audio.setAttribute('src', this.playList[this.playIndex].url);
			self._stop();		
		},
		_play: function(){
			audio.play();
			this.isPlaying = true;
		},
		_pause: function(){
			audio && audio.pause();
			this.isPlaying = false;
		},
		_stop: function(){
			try{
				audio.pause();
				audio.currentTime = 0;
				return true;
			}catch(e){}
		},
		_volume: function( value ){
			audio.volume = value;
		},
		_loadProgress: function(){ // 计算加载进度
			return Math.ceil( Math.ceil( this.buffered.end(0) ) / Math.ceil( this.duration ) * 100 );
		},
		_playProgress: function(){
			return parseInt(this.currentTime,10) / parseInt(this.duration,10) * 100;
		},
		_duration: function(){
			return this.duration;
		},
		events: {
			onPlay: function(){
				Player._play();
			},
			onPause: function(){
				Player._pause();
			},
			onVolume: function( value ){
				Player._volume( value );
			},
			onGetPlayStatus: function(){
				return Player.isPlaying;
			},
			onGetAudioInfo: function(){
				return Player.playList[Player.playIndex];
			}
		},
		ui:{
			onPlayProgress:function( pp ){}, 
			onDuration:function( duration ){}, // 曲目播放时长
			onLoadProgress:function( lp ){}, // 加载进度
			onPause:function(){}, // 暂停播放
			onError: function( errorStatus ){}
		}
	};
	var ListBox = {
		init: function( audios ){

		}
	};
	(function initialize(){
		Player.initEvent();
		expt[ns] = {
			init: Player.init,
			events: Player.events,
			ui: Player.ui
		};
	}())
}('AP',window));


