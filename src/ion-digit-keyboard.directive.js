angular.module('ion-digit-keyboard.directive', [])

.directive('ionDigitKeyboard', ['$timeout', '$ionicScrollDelegate',
	function ($timeout, $ionicScrollDelegate) {
		var animationDuration = 150;
		
		var template = [
			'<div class="digit-keyboard align-{{align}} keyboard-{{theme}} animation-{{animation}} {{roundButtons ? \'round-buttons\' : \'\'}} {{showLetters == false ? \'no-letters\' : \'\'}} {{(ngShow == false || ngHide == true) ? \'ng-hide\' : \'\'}}" style="width: {{width}};">',
			'	<div class="digit-keyboard-row">',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(1)">',
			'				<div class="digit-keyboard-key-number">1',
			'					<div class="digit-keyboard-key-letters"></div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(2)">',
			'				<div class="digit-keyboard-key-number">2',
			'					<div class="digit-keyboard-key-letters">ABC</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(3)">',
			'				<div class="digit-keyboard-key-number">3',
			'					<div class="digit-keyboard-key-letters">DEF</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'	</div>',
			'	<div class="digit-keyboard-row">',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(4)">',
			'				<div class="digit-keyboard-key-number">4',
			'					<div class="digit-keyboard-key-letters">GHI</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(5)">',
			'				<div class="digit-keyboard-key-number">5',
			'					<div class="digit-keyboard-key-letters">JKL</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(6)">',
			'				<div class="digit-keyboard-key-number">6',
			'					<div class="digit-keyboard-key-letters">MNO</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'	</div>',
			'	<div class="digit-keyboard-row">',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(7)">',
			'				<div class="digit-keyboard-key-number">7',
			'					<div class="digit-keyboard-key-letters">PQRS</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(8)">',
			'				<div class="digit-keyboard-key-number">8',
			'					<div class="digit-keyboard-key-letters">TUV</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(9)">',
			'				<div class="digit-keyboard-key-number">9',
			'					<div class="digit-keyboard-key-letters">WXYZ</div>',
			'				</div>',
			'			</div>',
			'		</div>',
			'	</div>',
			'	<div class="digit-keyboard-row">',
			'		<div class="digit-keyboard-key-wrapper {{showLeftAction == false ? \'hidden\' : \'\'}}">',
			'			<div class="digit-keyboard-key" ng-click="leftAction($event)" style="{{leftStyle}}">',
			'				<div class="digit-keyboard-key-action" ng-bind-html="leftHtml" style="{{leftFontSize}}"></div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper">',
			'			<div class="digit-keyboard-key" ng-click="numberAction(0)">',
			'				<div class="digit-keyboard-key-number" style="margin-top: -0.30em;">0</div>',
			'			</div>',
			'		</div>',
			'		<div class="digit-keyboard-key-wrapper {{showRightAction == false ? \'hidden\' : \'\'}}">',
			'			<div class="digit-keyboard-key" ng-click="rightAction($event)" style="{{rightStyle}}">',
			'				<div class="digit-keyboard-key-action" ng-bind-html="rightHtml" style="{{rightFontSize}}"></div>',
			'			</div>',
			'		</div>',
			'	</div>',
			'</div>'
		].join('');
		
		return {
			restrict: 'EA',
			template: template,
			replace: true,
			scope: {settings: '=settings', ngShow: '=', ngHide: '='},
			link: function postLink(scope, iElement, iAttrs) {
				if (typeof scope.settings == 'undefined') scope.settings = {};
				
				var elToResize, resizeContent = true, elToResizeSelector = 'ion-content';
				var heightAttr;
				var customLeftBg = {}, customRightBg = {};
				scope.leftStyle = '', scope.rightStyle = '';
				scope.leftFontSize = '', scope.rightFontSize = '';

				// General settings
				scope.showLetters = (typeof scope.settings.showLetters == 'undefined' ? false : scope.settings.showLetters);
				scope.roundButtons = (typeof scope.settings.roundButtons == 'undefined' ? false : scope.settings.roundButtons);
				scope.numberAction = scope.settings.action || function(){};
				scope.width = scope.settings.width || '100%';
				scope.align = scope.settings.align || 'center';
				
				// Animation
				scope.animation = scope.settings.animation || 'slide-up';
				
				// Styles
				scope.theme = scope.settings.theme || 'stable';
				if (typeof scope.settings.leftButton != 'undefined' && typeof scope.settings.leftButton.style == 'object') {
					if (typeof scope.settings.leftButton.style.color != 'undefined') {
						scope.leftStyle += 'color: ' + scope.settings.leftButton.style.color + ';';
					}
					if (typeof scope.settings.leftButton.style.bgColor != 'undefined') {
						customLeftBg.default = scope.settings.leftButton.style.bgColor;
						scope.leftStyle += 'background-color: ' + customLeftBg.default + ';';
					}
					if (typeof scope.settings.leftButton.style.activeBgColor != 'undefined') {
						customLeftBg.active = scope.settings.leftButton.style.activeBgColor;
					}
					if (typeof scope.settings.leftButton.style.borderColor != 'undefined') {
						scope.leftStyle += 'border-color: ' + scope.settings.leftButton.style.borderColor + ' !important;';
					}
					if (typeof scope.settings.leftButton.style.fontSize != 'undefined') {
						scope.leftFontSize = 'font-size: ' + scope.settings.leftButton.style.fontSize + ' !important;';
					}
				}
				if (typeof scope.settings.rightButton != 'undefined' && typeof scope.settings.rightButton.style == 'object') {
					if (typeof scope.settings.rightButton.style.color != 'undefined') {
						scope.rightStyle += 'color: ' + scope.settings.rightButton.style.color + ';';
					}
					if (typeof scope.settings.rightButton.style.bgColor != 'undefined') {
						customRightBg.default = scope.settings.rightButton.style.bgColor;
						scope.rightStyle += 'background-color: ' + customRightBg.default + ';';
					}
					if (typeof scope.settings.rightButton.style.activeBgColor != 'undefined') {
						customRightBg.active = scope.settings.rightButton.style.activeBgColor;
					}
					if (typeof scope.settings.rightButton.style.borderColor != 'undefined') {
						scope.rightStyle += 'border-color: ' + scope.settings.rightButton.style.borderColor + ' !important;';
					}
					if (typeof scope.settings.rightButton.style.fontSize != 'undefined') {
						scope.rightFontSize = 'font-size: ' + scope.settings.rightButton.style.fontSize + ' !important;';
					}
				}

				// Left action
				scope.showLeftAction = false;
				if (typeof scope.settings.leftButton != 'undefined') {		
					scope.leftHtml = scope.settings.leftButton.html;
					scope.showLeftAction = true;
					
					scope.leftAction = function(event) {
						if (customLeftBg.active) {
							var el = event.target;
							if (el.tagName == 'I') {
								el = el.parentNode.parentNode;
							} else if (el.className.indexOf('digit-keyboard-key-action') > -1) {
								el = el.parentNode;
							}

							if (typeof customLeftBg.default == 'undefined') customLeftBg.default = el.style.backgroundColor;
							el.style.backgroundColor = customLeftBg.active;
							
							setTimeout(function() {
								el.style.backgroundColor = customLeftBg.default;
							}, 100);
						}
						scope.settings.leftButton.action();
					}
				}
				
				// Right action
				scope.showRightAction = false;
				if (typeof scope.settings.rightButton != 'undefined') {
					scope.rightHtml = scope.settings.rightButton.html;
					scope.showRightAction = true;
					
					scope.rightAction = function(event) {
						if (customRightBg.active) {
							var el = event.target;
							if (el.tagName == 'I') {
								el = el.parentNode.parentNode;
							} else if (el.className.indexOf('digit-keyboard-key-action') > -1) {
								el = el.parentNode;
							}

							if (typeof customRightBg.default == 'undefined') customRightBg.default = el.style.backgroundColor;
							el.style.backgroundColor = customRightBg.active;
							
							setTimeout(function() {
								el.style.backgroundColor = customRightBg.default;
							}, 100);
						}
						scope.settings.rightButton.action();
					}
				}
				
				// Resize content
				if (typeof scope.settings.resizeContent == 'object' || typeof scope.settings.resizeContent == 'boolean') {	
					if (typeof scope.settings.resizeContent == 'object') {
						var resizeContent = (typeof scope.settings.resizeContent.enable == 'undefined' ? true : scope.settings.resizeContent.enable);
						var elToResizeSelector = (typeof scope.settings.resizeContent.element == 'undefined' ? 'ion-content' : scope.settings.resizeContent.element);
					} else if (typeof scope.settings.resizeContent == 'boolean') {
						resizeContent = scope.settings.resizeContent;
					}
				}
				elToResize = iElement[0].parentElement.querySelectorAll(elToResizeSelector)[0];
				
				// ngShow & ngHide handlers
				function doHide() {
					if (resizeContent == true) {
						elToResize.style.bottom = 0 + 'px';
						elToResize.style.height = heightAttr;
					}
				}
				
				function doShow() {
					$timeout(function() {
						if (resizeContent == true) {
							var bottomPos = iElement[0].offsetHeight;
							heightAttr = elToResize.style.height								
							elToResize.style.height = 'auto';
							elToResize.style.bottom = (bottomPos + 1) + 'px';
						}
					}, animationDuration + 10);
				}
				
				function ngShow() {
					if (scope.ngShow === true) {
						doShow();
					} else if (scope.ngShow === false) {
						doHide();
					}
					$ionicScrollDelegate.resize();
				}
				
				function ngHide() {
					if (scope.ngHide === true) {
						doHide();
					} else if (scope.ngHide === false) {
						doShow();
					}
					$ionicScrollDelegate.resize();
				}
				
				scope.$watch("ngShow", ngShow);
				scope.$watch("ngHide", ngHide);
			}
		}
	}															 
]);