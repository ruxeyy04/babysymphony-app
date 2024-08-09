import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const Profile = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  return (
    <View className='flex-1 justify-center items-center bg-primary'>
      <CustomButton
        title="Profile Menu"
        handlePress={handlePresentModalPress}
        containerStyles={{ width: '50%', marginTop: 28 }}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        enableDynamicSizing={true}  // Enable dynamic sizing
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <MenuItem icon={<Ionicons name='settings-outline' size={24}></Ionicons>} label="Profile Setting" />
          <MenuItem icon={<Ionicons name="exit-outline" size={24} color={"#fc0313"}></Ionicons>} label="Logout" />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

type MenuProps = {
  icon: any,
  label: string
}

const MenuItem = ({ icon, label }: MenuProps) => (
  <TouchableNativeFeedback
    background={TouchableNativeFeedback.Ripple('#ddd', false)}
    onPress={() => {
        router.push('/')
    }}
  >
    <View style={styles.menuItem} >
      {icon}
      <Text className='ml-[10px] text-[16px] font-pmedium text-[#333]'>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  bottomSheetView: {
    // padding: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
});

export default Profile;
