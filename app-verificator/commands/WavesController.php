<?php


namespace app\commands;

use Yii;
use yii\console\Controller;
use yii\console\ExitCode;
use deemru\WavesKit;
use yii\helpers\ArrayHelper;


class WavesController extends Controller
{
    public function actionIndex($message = 'hello world')
    {
        echo $message . "\n";

        return ExitCode::OK;
    }

    public function actionTestMail($email, $title, $text)
    {
        Yii::$app->mailer->compose()
            ->setTo($email)
            ->setSubject($title)
            ->setTextBody($text)
            //->setHtmlBody('<b>текст сообщения в формате HTML</b>')
            ->send();
    }

    public function actionEmail()
    {
        $oracleAddress = '3N9UfhqeB5hRaKF9LvQrT3naVFJ8cPUAo1m';
        $wk = new WavesKit('T');
        $wk->setSeed('used van valid throw alcohol pitch story olive drastic night kind chief');
        //$json = file_get_contents('https://api.testnet.wavesplatform.com/v0/transactions/data?sender=' . $oracleAddress . '&type=boolean&value=false&sort=desc&limit=100');
        $json = file_get_contents('https://testnode1.wavesnodes.com/addresses/data/' . $oracleAddress);
        $json = json_decode($json, true);
        if (!$json) {
            $this->log('Incorrect json');

            return ExitCode::OK;
        }

        foreach ($json as $item) {
            if (mb_strpos($item['key'], '_is_valid') !== false) {
                $email = str_replace('_is_valid', '', $item['key']);
                if (Yii::$app->cache->get('waves_' . $email) == 1) {
                    continue;
                } else {
                    $this->log('New email: ' . $email);
                    $code = bin2hex(random_bytes(20));
                    $this->sendMail($email, 'Waves Oracle Verification', 'Your verification code: ' . $code);
                    $txData = $wk->txData([
                        $email . '_code_hash' => base64_encode(hex2bin(hash('sha256', $code))),
                    ], ['fee' => 500000,]);
                    $tx = $wk->txBroadcast($wk->txSign($txData));
                    //$tx = $wk->ensure($tx);
                    //var_dump($tx);
                    Yii::$app->cache->set('waves_' . $email, 1, 0);
                }
            }
        }

        return ExitCode::OK;
    }

    private function sendMail($toEmail, $title, $text)
    {
        Yii::$app->mailer->compose()
            ->setFrom('bel.temp.mail@yandex.ru')
            ->setTo($toEmail)
            ->setSubject($title)
            ->setTextBody($text)
            //->setHtmlBody('<b>текст сообщения в формате HTML</b>')
            ->send();
    }

    private function log($text)
    {
        echo "[" . date('Y-m-d H:i:s') . "] - " . $text . "\r\n";
    }
}
