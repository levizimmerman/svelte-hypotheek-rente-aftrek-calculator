<script lang="ts">
	import { logEvent, type Analytics } from 'firebase/analytics';
	import Collapsible from '../lib/components/collapsible/collapsible.svelte';
	import Input from '../lib/components/input/input.svelte';
	import Label from '../lib/components/label/label.svelte';
	import Row from '../lib/components/row/row.svelte';
	import Switch from '../lib/components/switch/switch.svelte';
	import Tooltip from '../lib/components/tooltip/tooltip.svelte';
	import { onMount } from 'svelte';
	import { initFirebase } from '../lib/tools/firebase';
	import CalculationRow from '$lib/components/calculation-row/calculation-row.svelte';
	import { writable } from 'svelte/store';

	const firebase = initFirebase();
	const analytics = firebase.analytics;
	const isClient = typeof window !== 'undefined';
	const darkModeTheme = {
		'--bg': '#271F59',
		'--bg-brand': ' darkslateblue',
		'--bg-sheet': '#333',
		'--bg-sheet-level': '#3f3f3f',
		'--bg-sheet-level-border': '#666',
		'--text-on-bg': '#F1EFFF',
		'--text-on-brand': '#F1EFFF',
		'--text-on-sheet': '#F1EFFF',
		'--switch-bg': '#777',
		'--switch-toggle': '#f5f5f5'
	};
	const lightModeTheme = {
		'--bg': 'tomato',
		'--bg-brand': '#483d8b',
		'--bg-sheet': ' white',
		'--bg-sheet-level': '#f5f5f5',
		'--bg-sheet-level-border': '#bbb',
		'--text-on-bg': ' white',
		'--text-on-brand': ' white',
		'--text-on-sheet': ' darkslateblue',
		'--switch-bg': '#ccc',
		'--switch-toggle': ' white'
	};
	const getTaxRateBySalary = (_salary: number) => {
		if (_salary < 69399) {
			return 37.07;
		}
		return 49.5;
	};
	const getFromStorage = (key: string) => {
		if (!isClient) {
			return null;
		}
		return localStorage.getItem(key);
	};
	const setInStorage = (key: string, data: any) => {
		if (!isClient) {
			return;
		}
		localStorage.setItem(key, data);
	};
	const persistor = <T extends boolean | number | string>(key: string, initialValue: T) => {
		const store = writable(initialValue);
		store.subscribe((value) => {
			setInStorage(key, value.toString());
		});
		return store;
	};
	const persistBoolean = (key: string, bool: boolean) => {
		return persistor(key, getFromStorage(key) === 'true' || bool);
	};
	const persistNumber = (key: string, num: number) => {
		return persistor(key, Number(getFromStorage(key)) || num);
	};
	let mortgage = persistNumber('mortgage', 300000);
	let mortgageInterest = persistNumber('mortgageInterest', 4);
	let salary = persistNumber('salary', 60000);
	let taxRate = getTaxRateBySalary($salary);
	let showCalc = persistBoolean('showCalc', false);
	let darkMode = persistBoolean('darkMode', false);
	$: fontFamily = 'Poppins, sans-serif';
	$: mortgageCostPerYear = ($mortgage / 100) * $mortgageInterest;
	$: incomeMinusMortgageCostPerYear = $salary - mortgageCostPerYear;
	$: taxableIncome = ($salary / 100) * taxRate;
	$: taxableIncomeAfterDeduction = (incomeMinusMortgageCostPerYear / 100) * taxRate;
	$: taxDeduction = taxableIncome - taxableIncomeAfterDeduction;

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
		mortgage.update(() => Number(target.value));
		logEvent(analytics, 'mortgage_change', { mortgage: $mortgage });
	};
	const onMortgageInterestChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		mortgageInterest.update(() => Number(target.value));
		logEvent(analytics, 'mortgage_interest_change', { mortgageInterest: $mortgageInterest });
	};
	const onSalaryChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		salary.update(() => Number(target.value));
		taxRate = getTaxRateBySalary($salary);
		logEvent(analytics, 'salary_change', { salary: $salary });
	};
	const onTaxRateChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		taxRate = Number(target.value);
		logEvent(analytics, 'tax_rate_change', { taxRate: taxRate });
	};
	const setTheme = (theme: Record<string, string>) => {
        if (!isClient) {
            return;
        }
		Object.entries(theme).forEach(([key, value]) => {
			document.documentElement.style.setProperty(key, value);
		});
	};
	const onThemeToggle = () => {
		darkMode.update(() => !$darkMode);
		const theme = $darkMode ? darkModeTheme : lightModeTheme;
		setTheme(theme);
	};

	onMount(() => {
		setTheme($darkMode ? darkModeTheme : lightModeTheme);
	});
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
				<form>
					<Row>
						<Label forInput="hypotheek">Hypotheek</Label>
						<Input
							id="hypotheek"
							value={$mortgage}
							step={1000}
							formattedValue={formatPrice($mortgage)}
							onChange={onMortgageChange}
							jumpTo="hypotheekrente"
						/>
					</Row>
					<Row>
						<Label forInput="hypotheekrente">Hypotheekrente</Label>
						<Input
							id="hypotheekrente"
							step={0.1}
							value={$mortgageInterest}
							onChange={onMortgageInterestChange}
							formattedValue={formatPercentage($mortgageInterest)}
							jumpTo="jaarsalaris"
						/>
					</Row>
					<Row>
						<Label forInput="jaarsalaris">Jaarsalaris</Label>
						<Input
							id="jaarsalaris"
							value={$salary}
							step={100}
							onChange={onSalaryChange}
							formattedValue={formatPrice($salary)}
							jumpTo="inkomstenbelasting"
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
							jumpTo="bottom"
						/>
					</Row>
				</form>
			</div>
			<div class="bottom" id="bottom">
				<Collapsible collapsed={!$showCalc}>
					<CalculationRow>
						<p class="bold" slot="label">Inkomstenbelasting zonder renteaftrek</p>
						<div slot="calc">
							<Tooltip tip="Jaarsalaris">{formatPrice($salary)}</Tooltip> * <Tooltip
								tip="Inkomstenbelasting">{formatPercentage(taxRate)}</Tooltip
							>
						</div>
						<div slot="outcome">
							= <Tooltip tip="Belastbaar inkomen">{formatPrice(taxableIncome)}</Tooltip>
						</div>
					</CalculationRow>
					<CalculationRow>
						<p class="bold" slot="label">Kosten hypotheekrente per jaar</p>
						<div slot="calc">
							<Tooltip tip="Hypotheek">{formatPrice($mortgage)}</Tooltip> * <Tooltip
								tip="Hypotheekrente">{formatPercentage($mortgageInterest)}</Tooltip
							>
						</div>
						<div slot="outcome">
							= <Tooltip tip="Hypotheekrente kosten per jaar"
								>{formatPrice(mortgageCostPerYear)}</Tooltip
							>
						</div>
					</CalculationRow>
					<CalculationRow>
						<p class="bold" slot="label">Inkomstenbelasting met renteaftrek</p>
						<div slot="calc">
							<div>
								<Tooltip tip="Jaarsalaris">{formatPrice($salary)}</Tooltip> - <Tooltip
									tip="Hypotheekrente kosten per jaar">{formatPrice(mortgageCostPerYear)}</Tooltip
								>
							</div>
							<div>
								<Tooltip tip="Belastbaar inkomen met aftrek van de hypotheek rente kosten per jaar"
									>{formatPrice(incomeMinusMortgageCostPerYear)}</Tooltip
								> * <Tooltip tip="Inkomstenbelasting">{formatPercentage(taxRate)}</Tooltip>
							</div>
						</div>
						<div slot="outcome">
							<div class="nowrap">
								= <Tooltip
									tip="Belastbaar inkomen met aftrek van de hypotheek rente kosten per jaar"
									>{formatPrice(incomeMinusMortgageCostPerYear)}</Tooltip
								>
							</div>
							<div class="nowrap">
								= <Tooltip tip="Belastbaar inkomen na hypotheekrenteaftrek"
									>{formatPrice(taxableIncomeAfterDeduction)}</Tooltip
								>
							</div>
						</div>
					</CalculationRow>
				</Collapsible>
				<CalculationRow showCalc={$showCalc}>
					<p class="bold" slot="label">Totale hypotheekrenteaftrek</p>
					<div slot="calc">
						<Tooltip tip="Belastbaar inkomen">{formatPrice(taxableIncome)}</Tooltip> - <Tooltip
							tip="Belastbaar inkomen na hypotheekrenteaftrek"
							>{formatPrice(taxableIncomeAfterDeduction)}</Tooltip
						>
					</div>
					<div slot="outcome">
						{#if $showCalc}= {/if}
						<Tooltip tip="Belastingvoordeel">{formatPrice(taxDeduction)}</Tooltip>
					</div>
				</CalculationRow>
				<CalculationRow showCalc={$showCalc}>
					<p class="bold" slot="label">Verschil bruto en netto per maand</p>
					<div slot="calc">
						<Tooltip tip="Belastingvoordeel">{formatPrice(taxDeduction)}</Tooltip> / <Tooltip
							tip="Aantal maanden in het jaar">12</Tooltip
						>
					</div>
					<div slot="outcome" class="per-month-outcome">
						{#if $showCalc}= {/if}
						<Tooltip tip="Belasting voordeel per maand">{formatPrice(taxDeduction / 12)}</Tooltip
						><span class="per-month-label">per maand</span>
					</div>
				</CalculationRow>
				<div class="show-calc">
					<label for="toggle"
						>{#if $showCalc}Verberg berekening{:else}Toon berekening{/if}</label
					><Switch onToggle={(on) => showCalc.update(() => on)} id="toggle" toggled={$showCalc} />
				</div>
			</div>
		</div>
	</div>
	<button type="button" class="theme-toggle" on:click={onThemeToggle}
		>{$darkMode ? '🌝' : '🌚'}</button
	>
</div>

<style>
	:root {
		--bg: tomato;
		--bg-brand: #483d8b;
		--bg-sheet: white;
		--bg-sheet-level: #f5f5f5;
		--bg-sheet-level-border: #bbb;
		--text-on-bg: white;
		--text-on-brand: white;
		--text-on-sheet: darkslateblue;
		--switch-bg: #ccc;
		--switch-toggle: white;
	}
	:global(body) {
		background-color: var(--bg);
		color: var(--text-on-bg);
		text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
		font-size: 1.2rem;
		transition: background-color 0.5s ease;
	}
	.theme-toggle {
		background: transparent;
		border: none;
		text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
		border-radius: 50px;
		font-size: 2rem;
		cursor: pointer;
		transition: transform 0.5s ease;
		position: absolute;
		top: 2rem;
		right: 1rem;
	}
	.theme-toggle:hover {
		transform: rotate(45deg);
	}
	.theme-toggle:active {
		transform: rotate(360deg);
	}
	.per-month-outcome {
		position: relative;
	}
	.per-month-label {
		position: absolute;
		top: 100%;
		font-size: 0.8rem;
		white-space: nowrap;
		right: 0;
	}
	.page {
		font-family: var(--font-family);
	}
	.nowrap {
		white-space: nowrap;
	}
	.show-calc {
		position: absolute;
		top: 0;
		transform: translate(-50%, -50%);
		left: 50%;
		background-color: var(--bg-sheet);
		padding: 1rem;
		border-radius: 50px;
		font-size: 1rem;
		display: flex;
		gap: 1rem;
		align-items: center;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
		white-space: nowrap;
		transition: background-color 0.5s ease;
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
		padding: 0 2rem;
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
		background-color: var(--bg-brand);
		padding-bottom: 4rem;
		border-radius: 20px 20px 0 0;
	}
	.bottom {
		background-color: var(--bg-sheet);
		color: var(--text-on-sheet);
		text-shadow: none;
		position: relative;
		padding-top: 3rem;
		padding-bottom: 4rem;
		border-radius: 0 0 20px 20px;
		transition: background-color 0.5s ease;
	}
	@media screen and (max-width: 36rem) {
		h1 {
			font-size: 1.5rem;
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
