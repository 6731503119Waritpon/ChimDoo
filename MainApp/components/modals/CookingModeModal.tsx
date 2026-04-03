import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, Image,
    Dimensions, Platform, ScrollView
} from 'react-native';
import { BlurView } from 'expo-blur';
import { X, ChevronRight, ChevronLeft, CheckCircle2, CookingPot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppFonts } from '@/constants/theme';
import { Palette } from '@/types/common';

const { width } = Dimensions.get('window');

interface CookingModeModalProps {
    visible: boolean;
    onClose: () => void;
    steps: string[];
    foodName: string;
    foodImage: string;
    palette: Palette;
}

export default function CookingModeModal({
    visible, onClose, steps, foodName, foodImage, palette
}: CookingModeModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const progress = ((currentStep + 1) / (steps.length || 1)) * 100;

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!steps || steps.length === 0) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <BlurView intensity={100} tint="dark" style={s.root}>
                <View style={s.container}>
                    <View style={s.header}>
                        <View style={s.headerTop}>
                            <View style={s.titleRow}>
                                <CookingPot size={20} color={palette.accent} />
                                <Text style={s.headTitle} numberOfLines={1}>{foodName}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={s.progressContainer}>
                            <View style={[s.progressBar, { width: `${progress}%`, backgroundColor: palette.accent }]} />
                            <Text style={s.progressText}>Step {currentStep + 1} of {steps.length}</Text>
                        </View>
                    </View>

                    <View style={s.content}>
                        <View style={s.stepCard}>
                            <Image source={{ uri: foodImage }} style={s.stepImg} />
                            <LinearGradient 
                                colors={['transparent', 'rgba(0,0,0,0.8)']} 
                                style={StyleSheet.absoluteFillObject} 
                            />
                            <View style={s.stepInfo}>
                                <Text style={s.stepNumberLabel}>STEP {currentStep + 1}</Text>
                                <ScrollView contentContainerStyle={s.stepTextContainer} showsVerticalScrollIndicator={false}>
                                    <Text style={s.stepText}>{steps[currentStep]}</Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <View style={s.footer}>
                        <TouchableOpacity 
                            onPress={prevStep} 
                            style={[s.controlBtn, currentStep === 0 && { opacity: 0 }]}
                            disabled={currentStep === 0}
                        >
                            <ChevronLeft size={30} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={nextStep} activeOpacity={0.8}>
                            <LinearGradient 
                                colors={palette.gradient} 
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                style={s.mainAction}
                            >
                                <Text style={s.actionTxt}>
                                    {currentStep === steps.length - 1 ? 'FINISH' : 'NEXT STEP'}
                                </Text>
                                {currentStep === steps.length - 1 ? <CheckCircle2 size={22} color="#fff" /> : <ChevronRight size={22} color="#fff" />}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const s = StyleSheet.create({
    root: { flex: 1 },
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { paddingHorizontal: 24, marginBottom: 20 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    headTitle: { color: '#fff', fontSize: 18, fontFamily: AppFonts.bold, opacity: 0.9 },
    closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    
    progressContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'visible', position: 'relative' },
    progressBar: { height: '100%', borderRadius: 2 },
    progressText: { position: 'absolute', top: 12, right: 0, color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: AppFonts.medium },

    content: { flex: 1, justifyContent: 'center', padding: 24 },
    stepCard: { flex: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: '#1A1A1A', elevation: 10, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20 },
    stepImg: { width: '100%', height: '100%', opacity: 0.6 },
    stepInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32, maxHeight: '70%' },
    stepNumberLabel: { color: '#fff', fontSize: 14, fontFamily: AppFonts.bold, letterSpacing: 2, opacity: 0.6, marginBottom: 12 },
    stepTextContainer: { paddingBottom: 20 },
    stepText: { color: '#fff', fontSize: 26, fontFamily: AppFonts.bold, lineHeight: 36 },

    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 50 : 30 },
    controlBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    mainAction: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 32, height: 64, borderRadius: 32 },
    actionTxt: { color: '#fff', fontSize: 18, fontFamily: AppFonts.bold, letterSpacing: 1 },
});
