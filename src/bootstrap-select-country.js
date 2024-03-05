import $ from 'jquery';

import countries from "i18n-iso-countries";
import langs_nl from "i18n-iso-countries/langs/nl.json";
import langs_en from "i18n-iso-countries/langs/en.json";
import langs_de from "i18n-iso-countries/langs/de.json";
import langs_fr from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(langs_nl);
countries.registerLocale(langs_en);
countries.registerLocale(langs_de);
countries.registerLocale(langs_fr);

const languageMappings = {
	'nl': langs_nl, // Dutch
	'en': langs_en, // English
	'de': langs_de, // German
	'fr': langs_fr, // French
};

// Mapping country names with their codes
const countriesList = (locale) => {
	var langCountries = countries.getNames(locale);
	var countries_sorted = Object.keys(langCountries).map((code) => {
		return {
			name: langCountries[code],
			code: code
		};
	});
	// Sorting the countries array by country names
	countries_sorted.sort((a, b) => a.name.localeCompare(b.name));
	return countries_sorted;
};

let countrypicker = function(opts) {
	$(this).each(function(index, select) {
		var $select = $(select);
		var flag = $select.data('flag');
		var locale = $select.data('locale') || 'nl'; // Default to Dutch if no locale is provided
		console.log(locale);

		var countries = countriesList(locale);

		// filter countries of an option "data-countries" exist"
		var selectedCountries = $select.data('countries');
		if (selectedCountries && selectedCountries.length) {
			selectedCountries = selectedCountries.toUpperCase().split(',');
			countries = countries.filter(c => selectedCountries.includes(c.code));
		}

		var options = [];
		if (flag) {
				/* create option for each existing country */
				$.each(countries, function (index, country) {
					options.push(`<option
						data-tokens="${country.code} ${country.name}"
						data-icon="inline-flag flag ${country.code.toLowerCase()}"
						class="option-with-flag"
						value="${country.code}">${country.name}</option>`);
				});

		} else {
			//for each build list without flag
			$.each(countries, function (index, country) {
				options.push(`<option
					data-countrycode="${country.code}
					data-tokens="${country.code} ${country.name}"
					value="${country.code}">${country.name}</option>`);
			});
		}

		$select
			.addClass('f16')
			.html(options.join('\n'));

		//check if default
		var defaultCountryName = $select.data('default');
		//if there's a default, set it
		if (defaultCountryName) {
			$select.val(defaultCountryName.split(',').map((v) => v.trim()));
		}
	});
};

/* extend jQuery with the countrypicker function */
$.fn.countrypicker = countrypicker;

/* initialize all countrypicker by default. This is the default jQuery Behavior. */
$('.countrypicker').countrypicker();

/* return the countrypicker function for use as a module. */
export default countrypicker;
