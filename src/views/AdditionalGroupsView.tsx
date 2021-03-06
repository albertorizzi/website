import React from 'react';
import { Link, Text } from 'office-ui-fabric-react';
import { FontSizes, FontWeights } from '@fluentui/theme';
import { Container } from 'react-bootstrap';
import { FocusZone, List, IRectangle } from "@fluentui/react";
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import {getExtraGroups} from '../services/Requests';
import ExtraGroupView from '../components/ExtraGroup';
import ExtraGroup from '../models/ExtraGroup';

const AdditionalGroupsView = () => {
    const columnCount = React.useRef(0);
    const rowHeight = React.useRef(0);
    const rowsPerPage = React.useRef(0);
    const MAX_ROW_HEIGHT = 280;
    const groups: ExtraGroup[] = getExtraGroups();

    var classNames = mergeStyleSets({
        listGrid: {
            overflow: 'hidden',
            fontSize: 0,
            position: 'relative',
            marginBottom: 10,
            margin: '1px'
        }
    });

    const getItemCountForPage = React.useCallback((itemIndex?: number, surfaceRect?: IRectangle) => {
        if (itemIndex === 0) {
            /* rowHeight.current = Math.floor(surfaceRect!.width / columnCount.current) */ 
            columnCount.current = Math.ceil(surfaceRect!.width / MAX_ROW_HEIGHT);
            rowHeight.current = MAX_ROW_HEIGHT;
            rowsPerPage.current = surfaceRect!.height / MAX_ROW_HEIGHT;
        }
        return columnCount.current * rowsPerPage.current;
    }, []);
    
    const getPageHeight = React.useCallback((): number => {
        return rowHeight.current * rowsPerPage.current;
    }, []); 

    const getCell = (e?: ExtraGroup, index?: number, isScrolling?: boolean) => {
        return (
            <div data-is-focusable className="listGridTile" style={{ height: rowHeight.current + 'px', width: 100 / columnCount.current + '%' }}>
                <ExtraGroupView data={e!} />
            </div>
        )
    }

    return (
        <Container className="additional-groups text-center">
            <div className="mb-2">
                <Text style={{ fontSize: FontSizes.size14 }}>Qui è possibile trovare gruppi aggiuntivi del network. Se vorresti che ne fossero creati ulteriori puoi comunicarlo 
                sul <Link href="https://t.me/joinchat/VswKeAblS2nrfXME" target="_blank">gruppo principale</Link>.</Text>
            </div>

            <div className="mb-3">
                <Text styles={{ root: { fontSize: FontSizes.size14, fontWeight: FontWeights.semibold } }}>Gruppi disponibili:</Text>
            </div>

            <FocusZone>
                <List
                    className={classNames.listGrid}
                    items={groups}
                    getItemCountForPage={getItemCountForPage}
                    getPageHeight={getPageHeight}
                    renderedWindowsAhead={15}
                    onRenderCell={getCell}
                />
            </FocusZone>
        </Container>
    )
};

export default AdditionalGroupsView;