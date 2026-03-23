import '../css/Registration.css';
import { Country, State } from 'country-state-city';
import { useEffect, useState } from 'react';
import SuccessAlert from './alerts/SuccessAlert';
import ErrorAlert from './alerts/Erroralert';
import FillErrorAlert from './alerts/Fillerror';

let Registration=()=>{
	const [courses, setCourses] = useState(null);
	const [alert, setAlert] = useState({ type: '', open: false, message: '' });
	const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);

	useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            setStates(State.getStatesOfCountry(selectedCountry));
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

	useEffect(() => {
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => setCourses(data));
    }, []);
	
	const handleSubmit = async (e) => {
        e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
        const form = e.target;
        if (
            !form.reg_full_name.value.trim() ||
            !form.reg_date_of_birth.value.trim() ||
            !form.reg_gender.value ||
            !form.reg_mobile_number.value.trim() ||
            !form.reg_email.value.trim() ||
            !form.reg_course.value
        ) {
            setAlert({ type: 'fill', open: true, message: 'Please fill all required fields.' });
			setTimeout(() => setAlert({ ...alert, open: false }), 4000);
            return;
        }
		const data ={
			reg_full_name: form.reg_full_name.value,
            reg_date_of_birth: form.reg_date_of_birth.value,
            reg_gender: form.reg_gender.value,
            reg_qualification: form.reg_qualification.value,
            reg_mobile_number: form.reg_mobile_number.value,
            reg_email: form.reg_email.value,
            reg_guardian_name: form.reg_guardian_name.value,
            reg_guardian_occupation: form.reg_guardian_occupation.value,
            reg_guardians_mobile: form.reg_guardians_mobile.value,
            reg_course: form.reg_course.value,
            reg_training_mode: form.reg_training_mode.value,
            reg_training_location: form.reg_training_location.value,
            reg_preferred_timings: Array.from(form.querySelectorAll('input[name="reg_preferred_timings[]"]:checked')).map(cb => cb.value),
            reg_address: form.reg_address.value,
            reg_country: form.reg_country.value,
            reg_state: form.reg_state.value,
            reg_city: form.reg_city.value,
            reg_zip: form.reg_zip.value
		}
        const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    	if (response.ok) {
			setAlert({ type: 'success', open: true, message: 'Registration successful. Check your gmail!' });
			setTimeout(() => setAlert({ ...alert, open: false }), 4000);
            form.reset();
    	} else {
        	setAlert({ type: 'error', open: true, message: 'Registration failed. Please try again.' });
			setTimeout(() => setAlert({ ...alert, open: false }), 4000);
    	}
    };
    return(
		<div>
		{alert.type === 'success' && alert.open && (
                <SuccessAlert open={true} message={alert.message} />
            )}
            {alert.type === 'error' && alert.open && (
                <ErrorAlert open={true} message={alert.message} />
            )}
            {alert.type === 'fill' && alert.open && (
                <FillErrorAlert open={true} message={alert.message} />
            )}
		<title>SCOPE INDIA Registration | Learn Data Science, AI, Software, Networking, DevOps &amp; Cloud Courses, Online &amp; Offline</title>
		<section id="container_page_intro">
            <div>
                <h1>Course Registration at SCOPE INDIA</h1>
                <h2>Center for Software, Networking, &amp; Cloud Education</h2>
                <h3>
                    One of India's best Training destinations for Software, Networking, DevOps and Cloud Computing courses with 18 years of Industrial experience. Over 1,000 students find their dream careers each year, and we have assisted more than 15,000 students so far.
                </h3>
            </div>
        </section>
        <form onSubmit={handleSubmit} noValidate> 
		<section id="registration_head_container">
			<div>
				<label className="block_element" htmlFor="reg_full_name">Full Name (required)</label>
				<input className="block_element" type="text" id="reg_full_name" name="reg_full_name" minLength="3" maxLength="40" placeholder="" required></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_date_of_birth">Date of Birth (required)</label>
                <input className="block_element" type="date" id="reg_date_of_birth" name="reg_date_of_birth" placeholder="dd/mm/yyyy" required></input>
			</div>
			<div>
				<label className="block_element">Gender (required)</label>
				<label htmlFor="reg_gender1"><input type="radio" id="reg_gender1" name="reg_gender" value="Male" required></input> Male</label>
				<label htmlFor="reg_gender2"><input type="radio" id="reg_gender2" name="reg_gender" value="Female" required></input> Female</label>
				<label htmlFor="reg_gender3"><input type="radio" id="reg_gender3" name="reg_gender" value="Other" required></input> Other</label>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_qualification">Educational Qualification</label>
                <input className="block_element" type="text" id="reg_qualification" name="reg_qualification" minLength="2" maxLength="40" placeholder=""></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_mobile_number">Mobile Number (required)</label>
                <input className="block_element" type="tel" id="reg_mobile_number" name="reg_mobile_number" minLength="10" maxLength="15" placeholder="" required></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_email">Email (required)</label>
            	<input className="block_element" type="email" id="reg_email" name="reg_email" minLength="10" maxLength="50" placeholder="" required></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_guardian_name">Guardian's Name</label>
				<input className="block_element" type="text" id="reg_guardian_name" name="reg_guardian_name" minLength="3" maxLength="40" placeholder=""></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_guardian_occupation">Guardian's Occupation</label>
				<input className="block_element" type="text" id="reg_guardian_occupation" name="reg_guardian_occupation" minLength="4" maxLength="40" placeholder=""></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_guardians_mobile">Guardian's Mobile</label>
				<input className="block_element" type="tel" id="reg_guardians_mobile" minLength="10" maxLength="15" name="reg_guardians_mobile" placeholder=""></input>
			</div>
			<div>
    			<label className="block_element" htmlFor="reg_course">Choose your course (required)</label>
				<select id="reg_course" name="reg_course" title="Select preferred courses from the list" required>
					<option value="">Choose your course!</option>
					{courses && courses.map((course, idx) => (
						<optgroup key={idx} label={course.title}>
							{course.subCourses && course.subCourses.map((sub, subIdx) => (
								<option key={subIdx} value={sub}>{sub}</option>
							))}
						</optgroup>
					))}
				</select>
			</div>
			<div>
				<label className="block_element">Training Mode (required)</label>
				<label htmlFor="reg_training_mode1"><input type="radio" id="reg_training_mode1" name="reg_training_mode" value="Online" required></input> Live online</label>
				<label htmlFor="reg_training_mode2"><input type="radio" id="reg_training_mode2" name="reg_training_mode" value="Offline" required></input> Classroom</label>
			</div>
			<div>
				<label className="block_element">SCOPE INDIA Location (required)</label>
				<label htmlFor="reg_training_location5"><input type="radio" id="reg_training_location5" name="reg_training_location" value="Technopark TVM" required></input>&nbsp;Technopark&nbsp;TVM</label>
				<label htmlFor="reg_training_location1"><input type="radio" id="reg_training_location1" name="reg_training_location" value="Thampanoor TVM" required></input>&nbsp;Thampanoor&nbsp;TVM</label><br/>
				<label htmlFor="reg_training_location2"><input type="radio" id="reg_training_location2" name="reg_training_location" value="Kochi" required></input>&nbsp;Kochi</label>
                <label htmlFor="reg_training_location3"><input type="radio" id="reg_training_location3" name="reg_training_location" value="Nagercoil" required></input>&nbsp;Nagercoil</label>
                <label htmlFor="reg_training_location4"><input type="radio" id="reg_training_location4" name="reg_training_location" value="Online" required></input>&nbsp;Online</label>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_preferred_timings">Preferred Training Timings (required)</label>
				<label htmlFor="reg_preferred_timings1"><input type="checkbox" id="reg_preferred_timings1" name="reg_preferred_timings[]" value="Between 8am - 10am"></input> Between 8am - 10am</label><br/>
				<label htmlFor="reg_preferred_timings2"><input type="checkbox" id="reg_preferred_timings2" name="reg_preferred_timings[]" value="Between 9am - 1pm"></input> Between 9am - 1pm</label><br/>
				<label htmlFor="reg_preferred_timings3"><input type="checkbox" id="reg_preferred_timings3" name="reg_preferred_timings[]" value="Between 1pm - 6pm"></input> Between 1pm - 6pm</label><br/>
				<label htmlFor="reg_preferred_timings4"><input type="checkbox" id="reg_preferred_timings4" name="reg_preferred_timings[]" value="Between 6pm - 10pm"></input> Between 6pm - 10pm</label>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_address">Address</label>
				<input className="block_element" type="text" id="reg_address" name="reg_address" minLength="8" maxLength="150" placeholder=""></input>
			</div>
			<div>
                <label className="block_element" htmlFor="reg_country">Country</label>
                <select
                    className="block_element"
                    id="reg_country"
                    name="reg_country"
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                    required
                >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                        <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>
			<div>
                <label className="block_element" htmlFor="reg_state">State</label>
                <select
                    className="block_element"
                    id="reg_state"
                    name="reg_state"
                    value={selectedState}
                    onChange={e => setSelectedState(e.target.value)}
                    required
                    disabled={!selectedCountry}
                >
                    <option value="">Select State</option>
                    {states.map(state => (
                        <option key={state.isoCode} value={state.name}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </div>
			<div>
				<label className="block_element" htmlFor="reg_city">City</label>
				<input className="block_element" type="text" id="reg_city" name="reg_city" minLength="3" maxLength="60" placeholder=""></input>
			</div>
			<div>
				<label className="block_element" htmlFor="reg_zip">PIN/Zip Code</label>
				<input className="block_element" type="text" id="reg_zip" name="reg_zip" minLength="3" maxLength="10" placeholder=""></input>
			</div>
			<div className="submit_form">
				<button type="submit" id="call_back_visitor_click">Complete Registration &gt;&gt; </button>
			</div>
		</section>
		</form>
        </div>
    )
}
export default Registration;
