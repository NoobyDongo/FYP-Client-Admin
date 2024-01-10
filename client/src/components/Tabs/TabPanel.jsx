'use client'
import PropTypes from 'prop-types';
import FadeWrapper from '@/components/FadeWrapper'

export default function TabPanel({ children, value, index, ...other }) {
    return (
        <FadeWrapper
            key={value}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
        </FadeWrapper>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};