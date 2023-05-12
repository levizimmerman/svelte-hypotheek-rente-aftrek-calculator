<script lang="ts">
    import { logEvent } from "firebase/analytics";
    import type { Analytics } from "firebase/analytics";
	import Collapsible from '../lib/components/collapsible/collapsible.svelte';
	import Input from '../lib/components/input/input.svelte';
	import Label from '../lib/components/label/label.svelte';
	import Row from '../lib/components/row/row.svelte';
	import Switch from '../lib/components/switch/switch.svelte';
	import Tooltip from '../lib/components/tooltip/tooltip.svelte';
	import { onMount } from "svelte";
	import { initFirebase } from "$lib/tools/firebase";

	const getTaxRateBySalary = (_salary: number) => {
		if (_salary < 69399) {
			return 37.07;
		}
		return 49.5;
	};
	let mortgage = 360000;
	let mortgageInterest = 4;
	let salary = 60000;
	let taxRate = getTaxRateBySalary(salary);
	let showCalc = true;
    let analytics: Analytics;
	let housePrice = 400000;
	const realEstateTax = 0.5;
	$: fontFamily = 'Poppins, sans-serif';
	$: mortgageCostPerYear = (mortgage / 100) * mortgageInterest;
	$: incomeMinusMortgageCostPerYear = salary - mortgageCostPerYear;
	$: taxableIncome = (salary / 100) * taxRate;
	$: taxableIncomeAfterDeduction = (incomeMinusMortgageCostPerYear / 100) * taxRate;
	$: taxDeduction = taxableIncome - taxableIncomeAfterDeduction;

    onMount(() => {
        const firebase = initFirebase();
        analytics = firebase.analytics;
    });
	
    const formatPrice = (num: number) => {
		return Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(num);
	};
	const formatPercentage = (num: number) => {
		return Intl.NumberFormat('nl-NL', {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(num / 100);
	};
	const onMortgageChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
		mortgage = Number(target.value);
        logEvent(analytics, 'mortgage_change', { mortgage: mortgage });
	};
	const onMortgageInterestChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
		mortgageInterest = Number(target.value);
        logEvent(analytics, 'mortgage_interest_change', { mortgageInterest: mortgageInterest });
	};
	const onSalaryChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
		salary = Number(target.value);
		taxRate = getTaxRateBySalary(salary);
        logEvent(analytics, 'salary_change', { salary: salary });
	};
	const onTaxRateChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
		taxRate = Number(target.value);
        logEvent(analytics, 'tax_rate_change', { taxRate: taxRate });
	};
</script>

<svelte:head>
	<title>Bereken je netto maandlasten</title>
	<meta name="description" content="Bereken je netto maandlasten op basis van je hypotheek." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div style="--font-family: {fontFamily}" class="page">
	<div class="container">
		<h1>Bereken je netto maandlasten</h1>
	</div>
	<div class="container">
		<div class="card">
			<div class="top">
				<Row>
					<Label forInput="hypotheek">Hypotheek</Label>
					<Input
						id="hypotheek"
						value={mortgage}
						step={1000}
						formattedValue={formatPrice(mortgage)}
						onChange={onMortgageChange}
					/>
				</Row>
				<Row>
					<Label forInput="hypotheekrente">Hypotheekrente</Label>
					<Input
						id="hypotheekrente"
						step={0.1}
						value={mortgageInterest}
						onChange={onMortgageInterestChange}
						formattedValue={formatPercentage(mortgageInterest)}
					/>
				</Row>
				<Row>
					<Label forInput="jaarsalaris">Jaarsalaris</Label>
					<Input
						id="jaarsalaris"
						value={salary}
						step={100}
						onChange={onSalaryChange}
						formattedValue={formatPrice(salary)}
					/>
				</Row>
				<Row>
					<Label forInput="inkomstenbelasting">Inkomstenbelasting</Label>
					<Input
						id="inkomstenbelasting"
						value={taxRate}
						step={1}
						onChange={onTaxRateChange}
						formattedValue={formatPercentage(taxRate)}
					/>
				</Row>
			</div>
			<div class="bottom">
				<Collapsible collapsed={!showCalc}>
					<p class="bold">
						Inkomstenbelasting Zonder renteaftrek bedraagt de totale inkomstenbelasting
					</p>
					<ul>
						<li>
							<Tooltip tip="Jaarsalaris">{formatPrice(salary)}</Tooltip> * <Tooltip
								tip="Inkomstenbelasting">{formatPercentage(taxRate)}</Tooltip
							> = <Tooltip tip="Belastbaar inkomen">{formatPrice(taxableIncome)}</Tooltip>.
						</li>
					</ul>
					<p class="bold">Kosten hypotheekrente per jaar</p>
					<ul>
						<li>
							<Tooltip tip="Hypotheek">{formatPrice(mortgage)}</Tooltip> * <Tooltip
								tip="Hypotheekrente">{formatPercentage(mortgageInterest)}</Tooltip
							> = <Tooltip tip="Hypotheekrente kosten per jaar"
								>{formatPrice(mortgageCostPerYear)}</Tooltip
							>.
						</li>
					</ul>
					<p class="bold">Met renteaftrek bedraagt de inkomstenbelasting:</p>
					<ul>
						<li>
							<Tooltip tip="Jaarsalaris">{formatPrice(salary)}</Tooltip> - <Tooltip
								tip="Hypotheekrente kosten per jaar">{formatPrice(mortgageCostPerYear)}</Tooltip
							> = <Tooltip
								tip="Belastbaar inkomen met aftrek van de hypotheek rente kosten per jaar"
								>{formatPrice(incomeMinusMortgageCostPerYear)}</Tooltip
							><br />
						</li>
						<li>
							<Tooltip tip="Belastbaar inkomen met aftrek van de hypotheek rente kosten per jaar"
								>{formatPrice(incomeMinusMortgageCostPerYear)}</Tooltip
							> * <Tooltip tip="Inkomstenbelasting">{formatPercentage(taxRate)}</Tooltip> = <Tooltip
								tip="Belastbaar inkomen na hypotheekrenteaftrek"
								>{formatPrice(taxableIncomeAfterDeduction)}</Tooltip
							>
						</li>
					</ul>
				</Collapsible>
				<p class="bold">Totale hypotheekrenteaftrek:</p>
				<ul>
					{#if showCalc}
						<li>
							<Tooltip tip="Belastbaar inkomen">{formatPrice(taxableIncome)}</Tooltip> - <Tooltip
								tip="Belastbaar inkomen na hypotheekrenteaftrek"
								>{formatPrice(taxableIncomeAfterDeduction)}</Tooltip
							> = <Tooltip tip="Belastingvoordeel">{formatPrice(taxDeduction)}</Tooltip>
						</li>
					{:else}
						<li><Tooltip tip="Belastingvoordeel">{formatPrice(taxDeduction)}</Tooltip></li>
					{/if}
				</ul>
				<p class="bold">Het verschil tussen de bruto en netto maandlast bedraagt dus:</p>
				<ul>
					{#if showCalc}
						<li>
							<Tooltip tip="Belastingvoordeel">{formatPrice(taxDeduction)}</Tooltip> / <Tooltip
								tip="Aantal maanden in het jaar">12</Tooltip
							> = ~<Tooltip tip="Belasting voordeel per maand"
								>{formatPrice(taxDeduction / 12)}</Tooltip
							> per maand.
						</li>
					{:else}
						<li>
							~<Tooltip tip="Belasting voordeel per maand">{formatPrice(taxDeduction / 12)}</Tooltip
							> per maand.
						</li>
					{/if}
				</ul>
				<div class="show-calc">
					{#if showCalc}Verberg berekening{:else}Toon berekening{/if}<Switch
						onToggle={(on) => (showCalc = on)}
						toggled={showCalc}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: tomato;
		color: white;
		text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
		font-size: 1.2rem;
	}
	.page {
		font-family: var(--font-family);
	}
	li + li {
		margin-top: 1rem;
	}
	ul {
		list-style-position: inside;
		list-style-type: circle;
		padding: 0;
	}
	.show-calc {
		position: absolute;
		top: 0;
		transform: translate(-50%, -50%);
		left: 50%;
		background-color: white;
		padding: 1rem;
		border-radius: 50px;
		font-size: 1rem;
		display: flex;
		gap: 1rem;
		align-items: center;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
		white-space: nowrap;
	}
	.container {
		max-width: 32rem;
		margin: 0 auto;
	}
	h1 {
		text-align: left;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
		font-size: 2rem;
		margin: 2rem auto;
	}
	.bold {
		font-weight: bold;
		margin: 1rem 0;
	}
	.card {
		margin: 2rem 0;
		box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.25);
        border-radius: 20px;
	}
	.top,
	.bottom {
		padding: 2rem;
	}
	.top {
		background-color: darkslateblue;
		padding-bottom: 4rem;
		border-radius: 20px 20px 0 0;
	}
	.bottom {
		background-color: white;
		color: darkslateblue;
		text-shadow: none;
		position: relative;
		padding-top: 3rem;
		border-radius: 0 0 20px 20px;
	}
	@media screen and (max-width: 36rem) {
		h1 {
			font-size: 1.25rem;
		}
		:global(body) {
			font-size: 1rem;
		}
		.show-calc {
			font-size: 0.75rem;
			padding: 0.75rem;
		}
	}
</style>
