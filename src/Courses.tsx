import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Link, Text } from 'office-ui-fabric-react';
import { FontSizes } from '@fluentui/theme';
import { initializeIcons } from "@uifabric/icons";
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Dropdown, IDropdownOption, IDropdownProps } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import CourseListView from "./views/CourseListView";

initializeIcons();

const iconStyles = { marginRight: '8px' };

const onRenderOption = (option?: IDropdownOption): JSX.Element => {
    return (
        <div>
            {option?.data && option?.data.icon && (
                <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
            )}
            <span>{option?.text}</span>
        </div>
    );
};

const onRenderTitle = (options?: IDropdownOption[]): JSX.Element => {
    const option = options![0];

    return (
        <div>
            {option.data && option.data.icon && (
                <Icon style={iconStyles} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
            )}
            <span>{option.text}</span>
        </div>
    );
};

const onRenderPlaceholder = (props?: IDropdownProps): JSX.Element => {
    return (
        <div className="dropdownExample-placeholder">
            <Icon style={iconStyles} iconName={'SurveyQuestions'} aria-hidden="true" />
            <span>{props?.placeholder}</span>
        </div>
    );
};


const data = [
    {
        key: 'informatica', text: 'Dipartimento di Informatica', icon: 'TVMonitor',
        cdls: [
            { key: "triennale_informatica", text: "Informatica" },
            { key: "triennale_informatica_musicale", text: "Informatica musicale" },
            { key: "triennale_informatica_com_digitale", text: "Informatica comunicazione digitale" },
            { key: "triennale_sicurezza_sistemi_reti_informatiche",  text: "Sicurezza sistemi e reti informatiche" },
            { key: "triennale_sicurezza_sistemi_reti_informatiche_online", text: "Sicurezza sistemi e reti informatiche online" },
            { key: "magistrale_informatica", text: "Informatica (magistrale)" },
            { key: "magistrale_sicurezza_informatica", text: "Sicurezza informatica (magistrale)" }
        ]
    },
    {
        key: 'fisica', text: 'Dipartimento di Fisica', disabled: true, icon: 'ReleaseDefinition', 
        cdls: [
        ]
    },
    {
        key: 'matematica', text: 'Dipartimento di Matematica', disabled: true, icon: 'TimelineMatrixView',
        cdls: [
        ]
    },
    {
        key: 'agraria', text: 'Dipartimento di Agraria', disabled: true, icon: 'ReleaseDefinition',
        cdls: [
        ]
    },
    {
        key: 'medicina', text: 'Dipartimento di Medicina',  disabled: true, icon: 'Medical',
        cdls: [
        ]
    },
    {
        key: 'farmacia', text: 'Dipartimento di Farmacia',  disabled: true, icon: 'MobileReport',
        cdls: [
        ]
    }
]


const Courses = () => {
    
    const history = useHistory()

    const departmentSelectionChanged = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IDropdownOption
    ): void => {
        setSelectedDepartment(option?.key as string ?? '');
        setSelectedCdl(''); // Per resettare il corso di laurea quando cambio dipartimento, altrimenti rimane la lista dei gruppi precedente
        history.push(`/courses/${option?.key as string}`)
    };

    const cdlSelectionChanged = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IDropdownOption
    ): void => {
        setSelectedCdl(option?.key as string ?? '');
        history.push(`/courses/${selectedDepartment}/${option?.key as string}`);
    };

    let didMount = React.useRef(false);

    React.useEffect(() =>
    {
        if(!didMount.current)
        {
            didMount.current = true
            var states = history.location.pathname.substring(1).split('/').filter(x => x !== '');
            var initialDepartment = states.length >= 2 ? states[1] : '';
            var initialCdl = states.length >= 3 ? states[2] : '';
            initialDepartment = data.filter(x => x.key === initialDepartment).length > 0 ? initialDepartment : ''
            initialCdl = (initialDepartment !== '' && data.filter(x => x.key === initialDepartment)[0].cdls.filter(x => x.key === initialCdl).length >0) ? initialCdl:''
            setSelectedCdl(initialCdl)
            setSelectedDepartment(initialDepartment)
            history.push(`/courses/${initialDepartment}${initialCdl !== '' ? ("/" + initialCdl) : ''}`)
        }
    }, [history]);

    const [selectedDepartment, setSelectedDepartment] = React.useState<string>('');
    const [selectedCdl, setSelectedCdl] = React.useState<string>('');

    let departmentOptions: IDropdownOption[] = data.map(x => ({key: x.key, text: x.text, data: {icon:x.icon}, disabled: x.disabled}));
    let cdls: any[] = []
       
    if(selectedDepartment!=='') {
        let department = data.filter(x => x.key === selectedDepartment)[0]
        cdls = department.cdls
    }

    let cdlsOptions: IDropdownOption[] = cdls.map(x => ({key: x.key, text: x.text, data: {icon:x.icon}}));


    return (
        <Container className="courses text-center">
            <div className="text-center">
                <Text style={{ fontSize: FontSizes.size16 }}>
                    <div className="mb-0">Qui è possibile vedere i gruppi telegram, siti web, e faq (se disponibili)
                    di ogni corso didattico del tuo corso di laurea. </div>
                    <div className="mb-2">Se noti qualcosa che non corrisponde o che andrebbe sistemato puoi scriverlo sul <Link href="https://t.me/joinchat/VswKeAblS2nrfXME" target="_blank">gruppo principale</Link>.</div>
                    <div className="mb-4">
                        <Text style={{ fontSize: FontSizes.size12 }}>
                            <div className="mb-0">
                                I link alla <Text style={{ fontWeight: 600, fontSize: FontSizes.size12 }}>Wiki</Text> di un corso didattico potrebbero portare a pagine non ancora compilate: 
                            </div>
                            <div className="mb-0">
                                è qui che potete contribuire iscrivendovi e aiutandoci a raccogliere faq e qualsiasi altro contenuto utile per i corsi didattici.
                            </div>
                        </Text>
                    </div>
                </Text>
            </div>
            
            <div className="row department-choose justify-content-center mb-4">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-1">
                    {/* Department dropdown */}
                    <Dropdown
                        placeholder="Seleziona un dipartimento"
                        label="Seleziona un dipartimento"
                        onRenderPlaceholder={onRenderPlaceholder}
                        onRenderTitle={onRenderTitle}
                        onRenderOption={onRenderOption}
                        options={departmentOptions}
                        onChange={departmentSelectionChanged}
                        selectedKey={selectedDepartment}
                    />
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mb-1">
                    {/* Cdl dropdown */}
                    {selectedDepartment === '' ? 
                    <Dropdown
                        label="Seleziona un corso di laurea"
                        placeholder="Seleziona un corso di laurea"
                        selectedKey={selectedCdl}
                        onChange={cdlSelectionChanged}
                        options={cdlsOptions}
                        disabled
                    />
                    :                     
                    <Dropdown
                        label="Seleziona un corso di laurea"
                        placeholder="Seleziona un corso di laurea"
                        selectedKey={selectedCdl}
                        onChange={cdlSelectionChanged}
                        options={cdlsOptions}
                    />}
                </div>
            </div>

            <div style={{ display: selectedCdl ? 'block' : 'none' }}>
                <p className='text-center'>
                    <Text style={{ fontWeight: 600 }}>Gruppi disponibili:</Text>
                </p>
                <CourseListView cdl={selectedCdl} />
            </div>

        </Container>
    );
};

export default Courses;
