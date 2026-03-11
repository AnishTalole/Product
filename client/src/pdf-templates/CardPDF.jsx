import React from 'react';
import { Document, Page, Text, View, Image, Link } from '@react-pdf/renderer';
import { styles } from './CardPDFStyles';

const CardPDF = ({ data }) => {
    const iconBase = "https://my-product-app-backend-opfu.onrender.com/icons/";
    const uploadBase = "https://my-product-app-backend-opfu.onrender.com/uploads/";

    return (
        <Document title={`${data.name} Profile`}>
            <Page size="A4" style={styles.page}>
                
                {/* 1. BRAND IDENTITY HERO */}
                <View style={styles.heroCard}>
                    <View style={styles.profileFrame}>
                        {data.profileImage ? (
                            <Image src={`${uploadBase}profiles/${data.profileImage}`} />
                        ) : <View style={{backgroundColor: '#F1F5F9', flex:1}} />}
                    </View>
                    <View style={styles.heroTextSection}>
                        <Text style={styles.doctorName}>{data.name || "Specialist Name"}</Text>
                        <Text style={styles.clinicName}>{data.companyName || "Organization"}</Text>
                        <Text style={styles.subtitle}>{data.subtitle || "Field of Expertise"}</Text>
                    </View>
                </View>

                {/* 2. HIGH-ACTION GRID */}
                <View style={styles.actionGrid}>
                    <Link src={`tel:${data.mobile}`} style={[styles.actionBox, {backgroundColor: '#1E3A8A'}]}>
                        <Image src={`${iconBase}phone.png`} style={styles.actionIcon} />
                        <Text style={styles.actionLabel}>Call</Text>
                    </Link>
                    <Link src={`https://wa.me/${data.whatsapp}`} style={[styles.actionBox, {backgroundColor: '#16A34A'}]}>
                        <Image src={`${iconBase}whatsapp.png`} style={styles.actionIcon} />
                        <Text style={styles.actionLabel}>WhatsApp</Text>
                    </Link>
                    <Link src={`mailto:${data.email}`} style={[styles.actionBox, {backgroundColor: '#2563EB'}]}>
                        <Image src={`${iconBase}email.png`} style={styles.actionIcon} />
                        <Text style={styles.actionLabel}>Email</Text>
                    </Link>
                    <Link src={data.locationLink} style={[styles.actionBox, {backgroundColor: '#EA580C'}]}>
                        <Image src={`${iconBase}location.png`} style={styles.actionIcon} />
                        <Text style={styles.actionLabel}>Location</Text>
                    </Link>
                </View>

                {/* 3. GOOGLE RATING & BOOKING */}
                <View style={styles.trustBanner}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image src={`${iconBase}star.png`} style={styles.ratingStars} />
                        <Text style={styles.ratingText}>{data.googleRating || "5.0"} Star Patient Rating</Text>
                    </View>
                    {data.appointmentLink && (
                        <Link src={data.appointmentLink} style={styles.bookingLink}>
                            <Text style={styles.bookingText}>BOOK APPOINTMENT</Text>
                        </Link>
                    )}
                </View>

                {/* 4. BIO SECTION */}
                {data.details && (
                    <View>
                        <View style={styles.sectionDivider}>
                            <Text style={styles.sectionLabel}>Professional Profile</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        <Text style={styles.detailsParagraph}>{data.details}</Text>
                    </View>
                )}

                {/* 5. BRANCHES SECTION */}
                {data.branches?.length > 0 && (
                    <View>
                        <View style={styles.sectionDivider}>
                            <Text style={styles.sectionLabel}>{data.branchTitle || "Our Branches"}</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        {data.branches.map((branch, index) => (
                            <View key={index} style={styles.branchCard} wrap={false}>
                                <Text style={styles.branchName}>{branch.branchName}</Text>
                                <View style={styles.branchInfoRow}>
                                    <Image src={`${iconBase}location.png`} style={styles.infoIcon} />
                                    <Text style={styles.infoText}>{branch.branchAddress}</Text>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%'}}>
                                    <View style={styles.branchInfoRow}>
                                        <Image src={`${iconBase}phone.png`} style={styles.infoIcon} />
                                        <Text style={styles.infoText}>{branch.branchMobile}</Text>
                                    </View>
                                    <View style={styles.branchInfoRow}>
                                        <Image src={`${iconBase}calendar.png`} style={styles.infoIcon} />
                                        <Text style={styles.infoText}>{branch.branchTiming}</Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', marginTop: 15}}>
                                    <Link src={branch.branchLocation}><Text style={{fontSize: 10, color: '#2563EB', marginRight: 25}}>📍 Get Directions</Text></Link>
                                    <Link src={branch.branchGoogleProfile}><Text style={{fontSize: 10, color: '#2563EB'}}>⭐ Review Center</Text></Link>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* 6. IDENTITY FOOTER */}
                <View style={styles.footerWrap}>
                    <View style={styles.qrSquare}>
                        {data.qrCodePath && <Image src={`${uploadBase}qrcodes/${data.qrCodePath}`} />}
                    </View>
                    <View style={styles.footerCTA}>
                        <Text style={styles.ctaTitle}>Scan to Save Contact Details</Text>
                        <Text style={styles.ctaUrl}>View Digital Profile: card/{data.slug}</Text>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            {data.socialMedia?.map((s, i) => (
                                <Text key={i} style={{fontSize: 9, color: '#BFDBFE', marginRight: 15}}>{s.platform}</Text>
                            ))}
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default CardPDF;