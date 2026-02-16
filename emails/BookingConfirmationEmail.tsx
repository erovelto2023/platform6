
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import React from 'react';

interface BookingConfirmationEmailProps {
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    location?: string;
    businessName: string;
}

export const BookingConfirmationEmail = ({
    customerName,
    serviceName,
    date,
    time,
    location,
    businessName,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Detailed confirmation of your booking with {businessName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Booking Confirmed</Heading>
                    <Text style={text}>Hi {customerName},</Text>
                    <Text style={text}>
                        Your appointment for <strong>{serviceName}</strong> with {businessName} has been successfully booked.
                    </Text>

                    <Section style={detailsContainer}>
                        <Text style={detailRow}>
                            <strong>Date:</strong> {date}
                        </Text>
                        <Text style={detailRow}>
                            <strong>Time:</strong> {time}
                        </Text>
                        {location && (
                            <Text style={detailRow}>
                                <strong>Location:</strong> {location}
                            </Text>
                        )}
                    </Section>

                    <Hr style={hr} />

                    <Text style={footer}>
                        Need to reschedule? Reply to this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default BookingConfirmationEmail;

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const h1 = {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.25',
    marginBottom: '24px',
    color: '#484848',
};

const text = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
    marginBottom: '12px',
};

const detailsContainer = {
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '24px',
};

const detailRow = {
    ...text,
    marginBottom: '8px',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
};

const footer = {
    fontSize: '14px',
    color: '#8898aa',
};
