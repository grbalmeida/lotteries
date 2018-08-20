(function(){

	const latestRaffles = document.querySelector('[data-latest-raffles]')
	const raffleNumber = document.querySelector('[data-raffle-number]')
	const btn = document.querySelector('[data-btn]')
	const lotteryName = document.querySelector('[data-lottery]')
	const dozens = document.querySelector('[data-dozens]')

	raffleNumber.addEventListener('keydown', preventActionOnInput)
	btn.addEventListener('click', preventActionOnBtn)

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

	const allowedKeys = () => [13, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]

	const verifyAllowedKeys = (keys, event) => keys.indexOf(event) == -1

	const checkInputLength = () => raffleNumber.value.length == 4

	const lotteriesList = new Set(
		['megasena', 'quina', 'lotofacil', 'lotomania', 'timemania']
	)

	function searchLotteryRaffle() {
		if(raffleNumber.value.length > 0) {
			if(lotteriesList.has(lotteryName.value)) {
				makeAjaxRequest(lotteryName.value)
			}
		}
	}

	function makeAjaxRequest(lotteryName) {
		const raffleNumberValue = raffleNumber.value
		const response = new XMLHttpRequest()
		response.open('GET', formatUrl(lotteryName, raffleNumberValue, 'Tinpp5CfpJPp7zL'))
		response.send()
		response.addEventListener('readystatechange', function() {
			if(response.readyState === 4 && response.status === 200) {
				const responseDataRequest = JSON.parse(response.responseText)
				if(responseDataRequest.erro) {
					changeDozensContent('Concurso não encontrado')
				} else {
					generateTableWithDozens(responseDataRequest, generateLotteryName(lotteryName))
				}
			}
		})
		cleanFields()
	}

	function formatUrl(lottery, raffleNumber, token) {
		const url = 'http://confiraloterias.com.br/api0/json.php?'
		return `${url}loteria=${lottery}&token=${token}&concurso=${raffleNumber}`
	}

	const changeDozensContent = content => dozens.textContent = content

	function cleanFields() {
		raffleNumber.value = ''
		raffleNumber.focus()
	}

	function generateTableWithDozens(response, lotteryName) {
		dozens.innerHTML = 
			`<table>
				<tr>
					<th>Loteria</th>
					<th>Data do sorteio</th>
					<th>Dezenas</th>
				</tr>
				<tr>
					<td>${lotteryName}</td>
					<td>${response.concurso.data}</td>
					<td>${generateSpans(response.concurso.dezenas, lotteryName.toLowerCase())}</td>
				</tr>
			</table>`

	}

	function generateLotteryName(lotteryName) {
		const lotteries = {
			'megasena': 'Mega-Sena',
			'quina': 'Quina',
			'lotofacil': 'Lotofácil',
			'lotomania': 'Lotomania',
			'timemania': 'Timemania'
		}
		return lotteries[lotteryName]
	}

	function generateSpans(dozens, className) {
		let content = ''
		dozens.forEach(number => {
			content += `<span class="${className}">${number}</span>`
		})
		return content
	}

})()