(function(){

	const latestRaffles = document.querySelector('[data-latest-raffles]')
	const raffleNumber = document.querySelector('[data-raffle-number]')
	const btn = document.querySelector('[data-btn]')
	const lotteryName = document.querySelector('[data-lottery]')

	raffleNumber.addEventListener('keydown', preventActionOnInput)
	btn.addEventListener('click', preventActionOnBtn)

	function getNumberOfRafflesSearched() {
		return localStorage.getItem('numberOfRafflesSearched')
	}

	function setContentLatestRaffles() {
		if(!getNumberOfRafflesSearched()) {
			latestRaffles.textContent = 'Você não procurou nenhum sorteio ainda'
		}
	}

	function preventActionOnInput(event) {
		if(event.keyCode != 8) {
			if(verifyAllowedKeys(allowedKeys(), event.keyCode) || checkInputLength()) {
				event.preventDefault()
			}
		}
		if(event.keyCode == 13) {
			searchLotteryRaffle()
		}
	}

	function preventActionOnBtn(event) {
		event.preventDefault()
		searchLotteryRaffle()
	}

	function allowedKeys() {
		return [13, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
	}

	function verifyAllowedKeys(keys, event) {
		return keys.indexOf(event) == -1
	}

	function checkInputLength() {
		return raffleNumber.value.length == 4
	}

	function searchLotteryRaffle() {
		if(raffleNumber.value.length > 0) {
			switch(lotteryName.value) {
				case 'mega-sena':
					makeAjaxRequest('megasena')
					break
				case 'quina':
					makeAjaxRequest('quina')
					break
			}
		}
	}

	function makeAjaxRequest(lotteryName) {
		const raffleNumberValue = raffleNumber.value
		const response = new XMLHttpRequest()
		response.open('GET', formatUrl(lotteryName, raffleNumberValue))
		response.send()
		response.addEventListener('readystatechange', function() {
			if(response.readyState === 4 && response.status === 200) {
				console.log(response.responseText)
			}
		})
	}

	function formatUrl(lotteryName, raffleNumberValue) {
		return `http://confiraloterias.com.br/api0/json.php?loteria=${lotteryName}&token=VoKOwTa6Sp43g34&concurso=${raffleNumberValue}`
	}

	setContentLatestRaffles()

})()