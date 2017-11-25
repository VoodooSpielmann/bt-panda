<?php
/*
    Сниппет очистки телефона для протокола tel
    Обычное TV
    [[clearPhone? &input=`1234` &id=`1` &tv=`phone`]]
    Подойдет для MIGX
    [[+phone:clearPhone]]
*/
if($input){
    $output = str_replace(array('(', ')', '-', ' '), '' , $input);
} else {
    if (!empty($id) && is_numeric($id)) {
        if (!empty($tv)) {
            $resourcePhoneId = $modx->getObject('modResource', $id);
            $resourcePhoneTV = $resourcePhoneId->getTVValue($tv);
            $output = str_replace(array('(', ')', '-', ' '), '' , $resourcePhoneTV);
        } else {
            $output = '';
        }
    } else {
        $output = '';
    }
}
return $output;