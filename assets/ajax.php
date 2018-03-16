<?php
/*Если не ajax, то скрипт завершается*/
if ($_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest' || empty($_REQUEST['action'])) {
    exit();
}

/*Какое действие нужно совершить*/
$action = $_REQUEST['action'];

/*Подключение MODX API*/
define('MODX_API_MODE', true);
require_once dirname(dirname(__FILE__)) . '/index.php';

$modx->getService('error', 'error.modError');
$modx->getRequest();
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');
$modx->error->message = null;

/*Вывод*/
$output = '';

/*Экранирование и очистка*/
function formatstr($str)
{
    if (!is_array($str)) {
        $str = trim($str);
        $str = stripslashes($str);
        $str = htmlspecialchars($str);
    }
    return $str;
}

switch ($action) {

    case 'getMIGX':
        $migxid = isset($_POST['migxid']) ? (int)$_POST['migxid'] : 0;
        if (empty($migxid)) {
            exit();
        };

        //Запуск сниппета с параметрами
        $output = $modx->runSnippet('getImageList', array(
            'tvname' => 'nameOfMIGXTV',
            'where' => '{"MIGX_id:=":"' . $migxid . '"}',
            'tpl' => 'nameOfTpl'
        ));

    case 'getContent':
        $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
        if (empty($id)) {
            exit();
        };

        $object = $modx->getObject('modResource', $id);

        $output = array();

        //Обычные поля
        $output['content'] = $object->get('content');
        $output['pagetitle'] = $object->get('pagetitle');
        $output['alias'] = $object->get('alias');

        //TV
        $output['image'] = $object->getTVValue('image');

        $output = json_encode($output);

        //Обработка тегов MODX
        $maxIterations = (integer)$modx->getOption('parser_max_iterations', null, 10);
        $modx->getParser()->processElementTags('', $output, false, false, '[[', ']]', array(), $maxIterations);
        $modx->getParser()->processElementTags('', $output, true, true, '[[', ']]', array(), $maxIterations);
    default:
        exit();
}

@session_write_close();
exit($output);