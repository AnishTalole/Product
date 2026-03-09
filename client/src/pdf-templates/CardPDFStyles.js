import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#F8FAFC', // Professional cool-grey background
        fontFamily: 'Helvetica',
    },
    // Main Brand Identity Panel
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 30,
        flexDirection: 'row',
        alignItems: 'center',
        border: '1.5pt solid #E2E8F0',
        marginBottom: 25,
    },
    profileFrame: {
        width: 120, // Increased size
        height: 120,
        borderRadius: 60,
        border: '4pt solid #1E3A8A',
        overflow: 'hidden',
    },
    heroTextSection: {
        marginLeft: 30,
        flex: 1,
    },
    doctorName: {
        fontSize: 32, // Large and bold
        fontWeight: 'bold',
        color: '#1E3A8A',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    clinicName: {
        fontSize: 18, // Increased
        color: '#EA580C',
        fontWeight: 'bold',
        marginTop: 6,
    },
    subtitle: {
        fontSize: 14, // Increased
        color: '#64748B',
        marginTop: 6,
        fontStyle: 'italic',
    },
    // High-Impact Action Grid
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    actionBox: {
        width: '23.5%',
        paddingVertical: 15,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    actionIcon: {
        width: 20, // Larger icons
        height: 20,
        marginBottom: 8,
    },
    actionLabel: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    // High-Visibility Rating Section
    trustBanner: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1pt solid #1E3A8A',
        marginBottom: 25,
    },
    ratingStars: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    ratingText: {
        fontSize: 16, // Increased
        fontWeight: 'bold',
        color: '#1E293B',
    },
    bookingLink: {
        backgroundColor: '#1E3A8A',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    bookingText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    // Content Typography
    sectionDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    dividerLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#CBD5E1',
    },
    sectionLabel: {
        fontSize: 14, // Increased
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginHorizontal: 15,
        textTransform: 'uppercase',
    },
    detailsParagraph: {
        fontSize: 13, // Increased for readability
        color: '#475569',
        lineHeight: 1.8,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 25,
    },
    // Branch System
    branchCard: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderRadius: 25,
        marginBottom: 15,
        borderLeft: '8pt solid #1E3A8A', // Strong brand accent
        border: '1pt solid #E2E8F0',
    },
    branchName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
    },
    branchInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        width: 14,
        height: 14,
        marginRight: 10,
    },
    infoText: {
        fontSize: 11,
        color: '#64748B',
    },
    // Footer Branding
    footerWrap: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3A8A',
        padding: 30,
        borderRadius: 30,
    },
    qrSquare: {
        width: 90,
        height: 90,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 15,
    },
    footerCTA: {
        marginLeft: 25,
        flex: 1,
    },
    ctaTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    ctaUrl: {
        fontSize: 11,
        color: '#93C5FD',
        marginTop: 5,
    }
});