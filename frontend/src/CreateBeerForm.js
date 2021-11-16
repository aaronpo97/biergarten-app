import { useState, useEffect } from 'react';
import { Form, Button } from 'semantic-ui-react';
import FormField from './FormField.js';

const BeerForm = ({ beers, setBeers }) => {
	const [beerInfo, setBeerInfo] = useState(null);

	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [description, setDescription] = useState('');
	const [brewery, setBrewery] = useState('');
	const [location, setLocation] = useState('');
	const [image, setImage] = useState('');

	const handleSubmit = () => {
		setBeerInfo({ name, type, description, brewery, location, image });
	};

	useEffect(() => {
		const createBeerPost = async () => {
			try {
				if (!beerInfo) return;

				const url = 'http://localhost:5000/beer';
				const data = beerInfo;
				const response = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});

				console.log(response.status);

				setBeers([]);
				setName('');
				setType('');
				setDescription('');
				setBrewery('');
				setImage('');
				setLocation('');
			} catch (error) {}
		};

		createBeerPost();
	}, [beerInfo]);

	return (
		<Form onSubmit={e => handleSubmit(e)}>
			<FormField label='Name' setValue={setName} value={name} />
			<FormField label='Brewery' setValue={setBrewery} value={brewery} />
			<FormField
				label='Location'
				setValue={setLocation}
				value={location}
			/>
			<FormField
				label='Description'
				setValue={setDescription}
				value={description}
			/>
			<FormField label='Image' setValue={setImage} value={image} />

			<Button type='submit'>Submit</Button>
		</Form>
	);
};

export default BeerForm;
