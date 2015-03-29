app.controller("MainController", function($scope, $http){

	/* initialized scope variables */
	$scope.frontText = '';
	$scope.backText  = '';
	$scope.cards = [];
	$scope.activeCards = [];

	/* logic to prepare page */
	getLatestStacks();

	$scope.saveCard = function(){
		var card = {
			front_text: $scope.frontText,
			back_text:  $scope.backText
		};

		$scope.cards.push(card);

		$scope.frontText = '';
		$scope.backText  = '';
	}

	$scope.saveStack = function(){
		if($scope.frontText != '' && $scope.backText != '')
			$scope.saveCard();

		var stack = {
			stack: {
				name: $scope.stackName,
				cards_attributes: $scope.cards
			}
		};

		$http.post("http://localhost:3000/stacks", stack);

		resetText();
		$scope.stackName = '';

		getLatestStacks();
	}

	$scope.swapActive = function(index){
		setActiveStackAtIndex(index);
	}

	$scope.flipCard = function(index){
		$scope.activeCards[index].showFront = !$scope.activeCards[index].showFront;
	}

	/* private helper function */

	function resetText(){
		$scope.frontText = '';
		$scope.backText  = '';
	}

	function getLatestStacks(){
		$http.get("http://localhost:3000/stacks")
			.success(function(data){
				$scope.stacks = data;
				setActiveStackAtIndex(0);
			});
	}

	function setActiveStackAtIndex(index){
		for(var i=0; i<$scope.stacks.length; i++){
			//set first card in index active
			if(i == index)
				$scope.stacks[i].isActive = true;
			else
				$scope.stacks[i].isActive = false;
		}

		if($scope.stacks[index] != null)
			$http.get('http://localhost:3000/stacks/' + $scope.stacks[index].id + '/cards')
				.success(function(data){
					$scope.activeCards = data;
					for(activeCard in $scope.activeCards){
						activeCard.showFront = true;
					}
				});
	}
});