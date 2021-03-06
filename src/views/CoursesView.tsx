import React from "react";
import { Link, Text } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { initializeIcons } from "@uifabric/icons";
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Dropdown, IDropdownOption, IDropdownProps } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { useTheme } from '@fluentui/react-theme-provider';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CourseList from "../components/CourseList";
import DegreeInformations from "../components/DegreeInformations";
import { getDepartments } from '../services/Requests'
import Degree from "../models/Degree";
import Department from "../models/Department";

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

const CoursesView = () => {
    var theme = useTheme();
    const history = useHistory();
    const dropdownStyles = { 
        dropdown: { color: theme.palette.neutralPrimary },
        dropdownItems: { color: theme.palette.neutralPrimary },
    };

    const departmentSelectionChanged = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IDropdownOption
    ): void => {
        setSelectedDepartment(option?.key as string ?? '');
        setSelectedCdl(''); // Per resettare il corso di laurea quando cambio dipartimento, altrimenti rimane la lista dei gruppi precedente
        history.push(`/courses`)
    };

    const cdlSelectionChanged = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
        option?: IDropdownOption
    ): void => {
        setSelectedCdl(option?.key as string ?? '');
        history.push(`/courses/${option?.key as string}`);
    };

    let didMount = React.useRef(false);

    let departments = getDepartments()

    React.useEffect(() => {
        if(!didMount.current) {
            didMount.current = true;
            var states = history.location.pathname.substring(1).split('/').filter(x => x !== '');
            var initialCdl = states.length >= 2 ? states[1] : '';
            var possibleDepartments = departments.filter(x => x.cdls.filter(y => y.id === initialCdl).length > 0);
            let initialDepartment = possibleDepartments.length > 0 ? possibleDepartments[0].id : '';
            setSelectedCdl(initialCdl);
            setSelectedDepartment(initialDepartment);
            history.push(`/courses/${initialCdl}`);
        }
    }, [history, departments]);

    const [selectedDepartment, setSelectedDepartment] = React.useState<string>('');
    const [selectedCdl, setSelectedCdl] = React.useState<string>('');

    let departmentOptions: IDropdownOption[] = departments.map(x => ({key: x.id, text: x.name ?? "", data: {icon:x.icon}, disabled: x.cdls.length === 0}));
    let cdls: Degree[] = []
       
    if (selectedDepartment !=='') {
        let department: Department | undefined = departments.filter(x => x.id === selectedDepartment)[0];
        cdls = department?.cdls ?? [];
    }

    let cdlsOptions: IDropdownOption[] = cdls.map(x => ({key: x.id, text: x.name ?? ""}));

    let cdl = cdls.filter(x => x.id === selectedCdl)[0];

    return (
        <Container className="courses text-center">
            <div className="mb-1" style={{ lineHeight: "normal" }}>
                <Text style={{ fontSize: FontSizes.size14, lineHeight: "normal" }}>
                    Qui è possibile trovare i gruppi telegram, siti web, wiki, faq (se disponibili) e informazioni generali riguardo il tuo corso di laurea e i suoi corsi didattici.
                    Se noti qualcosa che non corrisponde o che andrebbe sistemato puoi 
                    comunicarlo sul <Link href="https://t.me/joinchat/VswKeAblS2nrfXME" target="_blank">gruppo principale</Link>.
                </Text>
            </div>
            <div className="mb-4" style={{ lineHeight: "normal" }}>
                <Text style={{ fontSize: FontSizes.size12 }}>
                    I link alla <span style={{ fontWeight: 600 }}>Wiki</span> di un corso didattico potrebbero portare a pagine non ancora compilate:<br/>
                    è qui che potete contribuire iscrivendovi e aiutandoci a raccogliere faq e qualsiasi altro contenuto utile per i corsi didattici.
                </Text>
            </div>
            {/*
            <div className="mb-4" style={{ lineHeight: "normal" }}>
                <Text style={{ fontSize: FontSizes.size12, fontFamily: 'Monaco, Menlo, Consolas', color: 'red' }}>
                    Si avvisa che da mobile è presente un bug quando viene raggiunta la fine della visualizzazione dei corsi.<br/>
                    In caso riscontriate questo problema siete invitati a usare i filtri appositi finchè non viene risolto il problema.
                </Text>
            </div>
            */}
            
            <Row className="department-choose justify-content-center mb-4">
                <Col xl={6} lg={6} md={6} sm={6} xs={12} className="mb-1">
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
                        styles={dropdownStyles}
                        theme={theme}
                    />
                </Col>

                <Col xl={6} lg={6} md={6} sm={6} xs={12} className="mb-1">
                    {/* Cdl dropdown */}
                    {selectedDepartment === '' ? 
                    <Dropdown
                        label="Seleziona un corso di laurea"
                        placeholder="Seleziona un corso di laurea"
                        selectedKey={selectedCdl}
                        onChange={cdlSelectionChanged}
                        options={cdlsOptions}
                        styles={dropdownStyles}
                        theme={theme}
                        disabled
                    />
                    :                     
                    <Dropdown
                        label="Seleziona un corso di laurea"
                        placeholder="Seleziona un corso di laurea"
                        selectedKey={selectedCdl}
                        onChange={cdlSelectionChanged}
                        options={cdlsOptions}
                        styles={dropdownStyles}
                        theme={theme}
                    />}
                </Col>
            </Row>


            <div style={{ display: selectedCdl !== '' ? 'block' : 'none' }}>
                <DegreeInformations cdl={cdl} />
                <p className='text-center'>
                    <Text styles={{ root: { fontWeight: FontWeights.semibold } }}>Gruppi disponibili:</Text>
                </p>                
                <CourseList cdl={cdl} />
            </div>

        </Container>
    );
};

export default CoursesView;
